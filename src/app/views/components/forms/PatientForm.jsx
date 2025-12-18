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
import { predictImage, submitFormData, submitImageAndPrediction, updatePatientInAPI } from "app/apis/patients_api";
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
  0: "HSIL",
  1: "LSIL",
  2: "Normal"
};

const getLargestIndex = (predictionArray) => {
  return predictionArray.indexOf(Math.max(...predictionArray));
};

const isPredictionValid = (predictionArray) => {
  return Array.isArray(predictionArray) && predictionArray.length > 0;
};


const PatientForm = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageSection, setShowImageSection] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [res, setRes] = useState({});
  const { user } = useAuth();
  const { state, dispatch } = useAppContext();
  // console.log("state", state)
  const [predictions, setPredictions] = useState({
    patient_id: null,
    image_url: null,
    image_prediction: null,
    patient_id: state.new_screening ? state.currentPatientId : null,
    doctor_id: user?.id,
  });

  const initialFormData = {
    first_name: "",
    last_name: "",
    birthdate: "1990-12-12",
    gender: "female",
    job: "job",
    email: "custom@gmail.com",
    mobile: "0974000000",
    region: "region",
    zone: "zone",
    kebele: "kebele",
    doctor_id: user?.id,
    health_institution: user?.health_institution?.id,
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
    setIsLoading(true);
    try {
      const prediction = await predictImage(imagePreview);
      if (prediction) {
        const updatedPredictions = {
          ...predictions,
          image_prediction: prediction?.predictions,
          image_url: prediction?.image_url,
        };
        setPredictions(updatedPredictions);
      }
      if (isPredictionValid(prediction?.predictions[0])) {
        const finalPredictions = {
          ...predictions,
          image_prediction: diagnosisLabels[getLargestIndex(prediction?.predictions[0])],
          image_url: prediction.image_url,
        };
        const response = await submitImageAndPrediction(finalPredictions);
        setRes(response);
      }
      else {
        const updatedPredictions = {
          ...predictions,
          image_prediction: null,
          image_url: prediction ? prediction.image_url : null,
        };
        setPredictions(updatedPredictions);
        const response = await submitImageAndPrediction(updatedPredictions);
        setRes(response);
      }
    } catch (error) {
      console.error("Error during diagnosis or updating patient data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(()=>{
  //   consol
  // },[])
  const handleShowImageSection = async () => {
    if (!formData.gender) {
      setGenderError(true);
      return;
    }

    try {
      const response = await submitFormData(formData);
      setPredictions((prev) => ({ ...prev, patient_id: response?.id }))
      setShowImageSection(true);
    } catch (error) {
      console.error("Error saving patient data:", error);
    }
  };
  return (
    <Container>
      <Stack spacing={3}>
        <SimpleCard title="Patient Details">
          {!showImageSection ? (
            <ValidatorForm onSubmit={handleShowImageSection}>
              <Grid container spacing={6}>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                  <TextField
                    type="text"
                    name="first_name"
                    label="First Name"
                    onChange={handleChange}
                    value={formData.first_name}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                  <TextField
                    type="text"
                    name="last_name"
                    label="Last Name"
                    onChange={handleChange}
                    value={formData.last_name}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                  <TextField
                    type="text"
                    name="mobile"
                    label="Mobile Number"
                    value={formData.mobile}
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
                    name="job"
                    label="Job"
                    onChange={handleChange}
                    value={formData.job}
                    validators={["required"]}
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>

                  <TextField
                    type="date"
                    name="birthdate"
                    label="Date of Birth"
                    onChange={handleChange}
                    value={formData.birthdate}
                    defaultValue="1990-12-12"
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
                  />
                  <TextField
                    type="text"
                    name="zone"
                    label="Zone"
                    onChange={handleChange}
                    value={formData.zone}
                    validators={["required"]}
                  />
                  <TextField
                    type="text"
                    name="kebele"
                    label="Kebele"
                    onChange={handleChange}
                    value={formData.kebele}
                    validators={["required"]}
                  />
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
                          <h4 style={{ maxWidth: "80%", maxHeight: "80%", textAlign: 'center' }}>Cervical Pap-Smear</h4>
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

export default PatientForm;

