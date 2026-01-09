import React, { useEffect, useState } from "react";
import {
  FormControlLabel,
  FormHelperText,
  FormLabel, IconButton, Radio, RadioGroup, Tooltip, Button, FormControl, InputLabel, MenuItem, Select, Grid, styled, CircularProgress, Box, Stack, Typography
} from "@mui/material";
import FlipIcon from '@mui/icons-material/Flip';
import { AddCircleOutline } from "@mui/icons-material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Span } from "app/components/Typography";
import { useDropzone } from "react-dropzone";
import { predictImage, submitFormData, submitImageAndPrediction, updateBroilerInAPI } from "app/apis/broiler_api";
import { SimpleCard } from "app/components";
import useAuth from "app/hooks/useAuth";
import { PredictionResult, AbnormalityDetection } from "./PredictionResult";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import useAppContext from "app/hooks/useAppContext";
import PhysicianDecisionDialog from "./PhysicianDecisionDialog";

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));
const dropzoneStyle = {
  border: "2px dashed #4a90e2",
  borderRadius: "4px",
  padding: "5px",
  textAlign: "center",
  cursor: "pointer",
  marginBottom: "10px",
  height: "50px",
  backgroundColor: "#f0f8ff",
}

const diagnosisLabels = {
  0: "Newcastle",
  1: "Normal",
  2: "Other abnormal"
};

const getLargestIndex = (predictionArray) => {
  return predictionArray.indexOf(Math.max(...predictionArray));
};

const isPredictionValid = (predictionArray) => {
  return Array.isArray(predictionArray) && predictionArray.length > 0;
};


const BroilerForm = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageSection, setShowImageSection] = useState(false);
  const [breedError, setbreedError] = useState(false);
  const [res, setRes] = useState({});
  const { user } = useAuth();
  // const supervisor_id = JSON.parse(localStorage.getItem("id"));
  const farm_institution = JSON.parse(localStorage.getItem("health_institution"))?.id;
  const { state, dispatch } = useAppContext();
  // console.log("state", state)
  const [predictions, setPredictions] = useState({
    broiler_id: null,
    broiler_image: null,
    image_prediction: null,
    broiler_id: state.new_screening ? state.currentBroilerId : null,
    // supervisor_id: user?.id,
  });

  const initialFormData = {
    farmer_name: "",
    farm_name: "",
    hatch_date: "2025-01-01",
    breed: "Red Ranger",
    Flock_ID: "Flock ID",
    email: "custom@gmail.com",
    Phone_Number: "0974000000",
    region: "region",
    zone: "zone",
    kebele: "kebele",
    // supervisor_id: supervisor_id || "",
    farm_institution: farm_institution || "",

  };

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (state.new_screening) setShowImageSection(true);
    return () => {
      if (state?.new_screening) dispatch({ type: 'STOP_NEW_SCREENING' });
    };
  }, [state?.new_screening, dispatch]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const imageFiles = acceptedFiles.filter((file) =>
        file.type.startsWith("image/")
      );
      if (imageFiles.length > 0) setImagePreview(imageFiles[0]);
    },
  });
  const handleChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });

  const handleDiagnose = async () => {
    if (!imagePreview) {
      alert("Please provide an image image for diagnosis.");
      return;
    }
    // 2. CHECK THE ID: If it is null or undefined, stop here!
    const b_id = predictions.broiler_id;
    if (!b_id || b_id === "undefined") {
      alert("Error: Broiler ID is missing. Please save the Broiler Details first.");
      console.error("Current predictions state:", predictions);
      return;
    }

    setIsLoading(true);
    try {
      const prediction = await predictImage(imagePreview, b_id);
      if (prediction) {
        const updatedPredictions = {
          ...predictions,
          image_prediction: prediction?.predictions,
          broiler_image: prediction?.broiler_image,
        };
        setPredictions(updatedPredictions);
      }
      if (isPredictionValid(prediction?.predictions[0])) {
        const finalPredictions = {
          ...predictions,
          image_prediction: diagnosisLabels[getLargestIndex(prediction?.predictions[0])],
          broiler_image: prediction?.broiler_image,
        };
        const response = await submitImageAndPrediction(finalPredictions);
        setRes(response);
      }
      else {
        const updatedPredictions = {
          ...predictions,
          image_prediction: null,
          broiler_image: prediction ? prediction.broiler_image : null,
        };
        setPredictions(updatedPredictions);
        const response = await submitImageAndPrediction(updatedPredictions);
        setRes(response);
      }
    } catch (error) {
      console.error("Error during diagnosis or updating broiler data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(()=>{
  //   consol
  // },[])
  // const handleShowImageSection = async () => {
  //   console.log("Submit clicked");
  //   if (!formData.breed) {
  //     setbreedError(true);
  //     return;
  //   }

  //   try {
  //     const response = await submitFormData(formData);
  //     setPredictions((prev) => ({ ...prev, broiler_id: response?.id }))
  //     setShowImageSection(true);
  //   } catch (error) {
  //     console.error("Error saving broiler data:", error);
  //   }
  // };
  const handleShowImageSection = async () => {
    console.log("Submit clicked");
    if (!formData.breed) {
      setbreedError(true);
      return;
    }

    try {
      const response = await submitFormData(formData);

      // FIX: Explicitly check if the ID exists in the response
      if (response && response.id) {
        console.log("Received Broiler ID:", response.id); // Debugging line
        setPredictions((prev) => ({ ...prev, broiler_id: response.id }));
        setShowImageSection(true);
      } else {
        // If the backend didn't return an ID, don't let the user continue
        alert("The server did not return a Broiler ID. Please check your network or backend.");
        console.error("Server response was:", response);
      }

    } catch (error) {
      console.error("Error saving broiler data:", error);
      alert("Failed to save broiler details. Please try again.");
    }
  };
  return (
    <Container>
      <Stack spacing={3}>
        <SimpleCard title="Broiler Details">
          {!showImageSection ? (
            <ValidatorForm onSubmit={handleShowImageSection}>
              <Grid container spacing={6}>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <TextField
                    type="text"
                    name="farmer_name"
                    label="Farmer Name"
                    onChange={handleChange}
                    value={formData.farmer_name}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                  <TextField
                    type="text"
                    name="farm_name"
                    label="Farm Name"
                    onChange={handleChange}
                    value={formData.farm_name}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                  <TextField
                    type="text"
                    name="Phone_Number"
                    label="Phone Number"
                    value={formData.Phone_Number}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                  <TextField
                    type="text"
                    name="breed"
                    label="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                  <TextField
                    type="email"
                    name="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />

                  <TextField
                    type="text"
                    name="Flock_ID"
                    label="Flock ID"
                    onChange={handleChange}
                    value={formData.Flock_ID}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>

                  <TextField
                    type="date"
                    name="hatch_date"
                    label="Hatch Date"
                    onChange={handleChange}
                    value={formData.hatch_date}
                    defaultValue="2025-01-01"
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />

                  <TextField
                    type="text"
                    name="region"
                    label="Region"
                    onChange={handleChange}
                    value={formData.region}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                  <TextField
                    type="text"
                    name="zone"
                    label="Zone"
                    onChange={handleChange}
                    value={formData.zone}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                  <TextField
                    type="text"
                    name="kebele"
                    label="Kebele"
                    onChange={handleChange}
                    value={formData.kebele}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                  {/* <TextField
                    type="text"
                    name="farm_institution"
                    label="Farm Institution"
                    onChange={handleChange}
                    value={formData.farm_institution}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  // />
                  // <TextField
                  //   type="text"
                  //   name="supervisor_id"
                  //   label="Supervisor ID"
                  //   onChange={handleChange}
                  //   value={formData.supervisor_id}
                  //   validators={["required"]}
                  //   errorMessages={["this field is required"]}
                  /> */}
                </Grid>
              </Grid>

              <Button
                sx={{
                  bgcolor: '#181b62',
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: '#fa931d',
                  },
                }}
                variant="contained"
                type="submit"
              >
                <Span sx={{ pl: 1, textTransform: 'capitalize' }}>
                  Save and Continue
                </Span>
              </Button>

            </ValidatorForm>
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid item lg={8} md={8} sm={10} xs={12} sx={{ mt: 2 }}>
                  <div {...getRootProps()} style={dropzoneStyle}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop an image here, or click to select one</p>
                  </div>
                </Grid>
                <Grid item lg={4} md={4} sm={2} xs={12} sx={{ mt: 2 }}>
                  <br />
                  {/* Predict Button */}
                  <Button
                    variant="contained"
                    onClick={handleDiagnose}
                    disabled={isLoading}
                    sx={{
                      bgcolor: '#181b62',
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: '#fa931d',
                      },
                    }}
                  >
                    <Span sx={{ pl: 1, textTransform: "capitalize" }}>
                      Diagnosis
                    </Span>
                  </Button>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={12} md={7}>
                  <Box component="section" sx={{ p: 2, border: '1px dashed grey', borderRadius: '5px' }}>
                    {imagePreview && (
                      <>

                        <div style={{ display: "flex", justifyContent: "center" }}>
                          <h4 style={{ maxWidth: "80%", maxHeight: "80%", textAlign: 'center' }}>Broiler Fecal Image</h4>
                        </div>
                        <Zoom>
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <img
                              src={URL.createObjectURL(imagePreview)}
                              alt="Image"
                              style={{ width: "80%", height: "60%", cursor: "pointer" }}
                            />
                          </div>
                        </Zoom>

                      </>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={5}>

                  <Box component="section" sx={{ p: 2, border: '1px dashed darkblue', borderRadius: '5px' }}>
                    <Typography variant="h6" component="div" sx={{ marginBottom: 1, textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FlipIcon sx={{ color: '#fa931d' }} />               &nbsp;&nbsp;&nbsp;   Diagnosis Result &nbsp;&nbsp;&nbsp;
                        {(predictions.image_prediction) && (
                          <>
                            <Tooltip title="Add Feedback">
                              <IconButton
                                onClick={handleOpenDialog}
                                sx={{ align: "right", "&:hover": { bgcolor: "grey.200" } }}
                              >
                                <AddCircleOutline sx={{ color: "#E53935" }} />
                              </IconButton>
                            </Tooltip>
                            <PhysicianDecisionDialog open={dialogOpen} onClose={handleCloseDialog} Result={res} />
                          </>
                        )}
                      </div>

                    </Typography>
                    {isLoading && (
                      <div style={{ textAlign: "center" }}>
                        <CircularProgress />
                      </div>
                    )}
                    {(predictions.image_prediction) && (
                      <>
                        <AbnormalityDetection
                          data={predictions.image_prediction ? predictions.image_prediction[0] : [0]}
                        />
                      </>
                    )}
                    {predictions.image_prediction && (
                      <PredictionResult data={predictions.image_prediction ? predictions.image_prediction[0] : [0]} />
                    )}
                  </Box>
                </Grid>
              </Grid>

            </>
          )}
        </SimpleCard>
      </Stack>
    </Container >
  );
}

export default BroilerForm;

