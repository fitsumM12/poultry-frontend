// // import React, { useEffect, useState } from "react";
// import {
//   Button,
//   Grid,
//   styled,
//   CircularProgress,
//   Box,
//   Stack,
//   Typography,
//   IconButton,
//   Tooltip
// } from "@mui/material";
// import FlipIcon from '@mui/icons-material/Flip';
// import { AddCircleOutline } from "@mui/icons-material";
// import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
// import { Span } from "app/components/Typography";
// import { useDropzone } from "react-dropzone";
// import { predictImage, submitFormData, submitImageAndPrediction } from "app/apis/broiler_api";
// import { SimpleCard } from "app/components";
// import useAuth from "app/hooks/useAuth";
// import { PredictionResult, AbnormalityDetection } from "./PredictionResult";
// import Zoom from "react-medium-image-zoom";
// import "react-medium-image-zoom/dist/styles.css";
// import useAppContext from "app/hooks/useAppContext";
// import PhysicianDecisionDialog from "./PhysicianDecisionDialog";
// import React, { useEffect, useState } from "react";
// const TextField = styled(TextValidator)(() => ({
//   width: "100%",
//   marginBottom: "16px",
// }));

// const Container = styled("div")(({ theme }) => ({
//   margin: "30px",
//   [theme.breakpoints.down("sm")]: { margin: "16px" },
// }));

// const dropzoneStyle = {
//   border: "2px dashed #4a90e2",
//   borderRadius: "4px",
//   padding: "5px",
//   textAlign: "center",
//   cursor: "pointer",
//   marginBottom: "10px",
//   height: "50px",
//   backgroundColor: "#f0f8ff",
// };

// const diagnosisLabels = {
//   0: "Newcastle",
//   1: "Normal",
//   2: "Other abnormal"
// };

// const getLargestIndex = (predictionArray) => predictionArray.indexOf(Math.max(...predictionArray));
// const isPredictionValid = (predictionArray) => Array.isArray(predictionArray) && predictionArray.length > 0;

// const BroilerForm = () => {
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [showImageSection, setShowImageSection] = useState(false);
//   const [res, setRes] = useState({});
//   const { user } = useAuth();
//   const farm_institution = JSON.parse(localStorage.getItem("health_institution"))?.id;
//   const { state, dispatch } = useAppContext();

//   // FIXED: Removed duplicate broiler_id key
//   const [predictions, setPredictions] = useState({
//     broiler_id: state.new_screening ? state.currentBroilerId : null,
//     broiler_image: null,
//     image_prediction: null,
//   });

//   const initialFormData = {
//     farmer_name: "",
//     farm_name: "",
//     hatch_date: "2025-01-01",
//     breed: "Red Ranger",
//     Flock_ID: "Flock ID",
//     email: "custom@gmail.com",
//     Phone_Number: "0974000000",
//     region: "region",
//     zone: "zone",
//     kebele: "kebele",
//     supervisor_id: user?.id || "",
//     farm_institution: farm_institution || "",
//   };

//   const [formData, setFormData] = useState(initialFormData);

//   const handleOpenDialog = () => setDialogOpen(true);
//   const handleCloseDialog = () => setDialogOpen(false);
//   const handleChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop: (acceptedFiles) => {
//       const imageFiles = acceptedFiles.filter((file) => file.type.startsWith("image/"));
//       if (imageFiles.length > 0) setImagePreview(imageFiles[0]);
//     },
//   });

//   const handleShowImageSection = async () => {
//     try {
//       const response = await submitFormData(formData);
//       if (response && response.id) {
//         setPredictions((prev) => ({ ...prev, broiler_id: response.id }));
//         setShowImageSection(true);
//       } else {
//         alert("The server did not return a Broiler ID.");
//       }
//     } catch (error) {
//       console.error("Error saving broiler data:", error);
//     }
//   };

//   const handleDiagnose = async () => {
//     if (!imagePreview) {
//       alert("Please provide an image for diagnosis.");
//       return;
//     }

//     const b_id = predictions.broiler_id;
//     if (!b_id || b_id === "undefined") {
//       alert("Error: Broiler ID is missing. Please save details first.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const prediction = await predictImage(imagePreview, b_id);
//       if (prediction && isPredictionValid(prediction?.predictions[0])) {
//         const finalPredictions = {
//           ...predictions,
//           image_prediction: diagnosisLabels[getLargestIndex(prediction?.predictions[0])],
//           broiler_image: prediction?.broiler_image,
//         };
//         const response = await submitImageAndPrediction(finalPredictions);
//         setPredictions(prev => ({ ...prev, image_prediction: prediction.predictions, broiler_image: prediction.broiler_image }));
//         setRes(response);
//       }
//     } catch (error) {
//       console.error("Diagnosis error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Container>
//       {!showImageSection ? (
//         <ValidatorForm onSubmit={handleShowImageSection}>
//           <Stack spacing={3}>
//             {/* CARD 1: FARMER INFO */}
//             <SimpleCard title="Farmer & Farm Information">
//               <Grid container spacing={3}>
//                 <Grid item lg={6} md={6} sm={12} xs={12}>
//                   <TextField label="Farmer Name" name="farmer_name" onChange={handleChange} value={formData.farmer_name} validators={["required"]} errorMessages={["required"]} />
//                   <TextField label="Farm Name" name="farm_name" onChange={handleChange} value={formData.farm_name} />
//                   <TextField label="Phone Number" name="Phone_Number" onChange={handleChange} value={formData.Phone_Number} />
//                   <TextField label="Email" name="email" onChange={handleChange} value={formData.email} />
//                 </Grid>
//                 <Grid item lg={6} md={6} sm={12} xs={12}>
//                   <TextField label="Region" name="region" onChange={handleChange} value={formData.region} />
//                   <TextField label="Zone" name="zone" onChange={handleChange} value={formData.zone} />
//                   <TextField label="Kebele" name="kebele" onChange={handleChange} value={formData.kebele} />
//                 </Grid>
//               </Grid>
//             </SimpleCard>

//             {/* CARD 2: BROILER INFO */}
//             <SimpleCard title="Broiler Unit Details">
//               <Grid container spacing={3}>
//                 <Grid item lg={6} md={6} sm={12} xs={12}>
//                   <TextField label="Breed" name="breed" onChange={handleChange} value={formData.breed} validators={["required"]} />
//                   <TextField label="Flock ID" name="Flock_ID" onChange={handleChange} value={formData.Flock_ID} />
//                 </Grid>
//                 <Grid item lg={6} md={6} sm={12} xs={12}>
//                   <TextField type="date" label="Hatch Date" name="hatch_date" onChange={handleChange} value={formData.hatch_date} />
//                 </Grid>
//               </Grid>
//             </SimpleCard>

//             <Button variant="contained" type="submit" sx={{ bgcolor: '#181b62', width: '200px', alignSelf: 'flex-start' }}>
//               Save and Continue
//             </Button>
//           </Stack>
//         </ValidatorForm>
//       ) : (
//         <SimpleCard title="Diagnosis & Results">
//           <Grid container spacing={2}>
//             <Grid item lg={8} xs={12}>
//               <div {...getRootProps()} style={dropzoneStyle}>
//                 <input {...getInputProps()} />
//                 <p>Drag 'n' drop fecal image here</p>
//               </div>
//               {imagePreview && (
//                 <Box sx={{ textAlign: 'center', mt: 2 }}>
//                   <Typography variant="subtitle1">Broiler Fecal Image</Typography>
//                   <Zoom>
//                     <img src={URL.createObjectURL(imagePreview)} alt="Preview" style={{ width: "100%", maxHeight: "300px", objectFit: 'contain' }} />
//                   </Zoom>
//                 </Box>
//               )}
//             </Grid>
//             <Grid item lg={4} xs={12}>
//               <Button fullWidth variant="contained" onClick={handleDiagnose} disabled={isLoading} sx={{ bgcolor: '#181b62', mb: 2 }}>
//                 {isLoading ? <CircularProgress size={24} color="inherit" /> : "Run Diagnosis"}
//               </Button>

//               <Box sx={{ p: 2, border: '1px dashed #181b62', borderRadius: '5px' }}>
//                 <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                   <FlipIcon sx={{ color: '#fa931d', mr: 1 }} /> Result
//                   {predictions.image_prediction && (
//                     <IconButton onClick={handleOpenDialog} size="small"><AddCircleOutline sx={{ color: "red" }} /></IconButton>
//                   )}
//                 </Typography>

//                 {predictions.image_prediction && (
//                   <>
//                     <AbnormalityDetection data={predictions.image_prediction[0]} />
//                     <PredictionResult data={predictions.image_prediction[0]} />
//                   </>
//                 )}
//               </Box>
//             </Grid>
//           </Grid>
//           <PhysicianDecisionDialog open={dialogOpen} onClose={handleCloseDialog} Result={res} />
//         </SimpleCard>
//       )}
//     </Container>
//   );
// };

// export default BroilerForm;
// import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  styled,
  CircularProgress,
  Box,
  Stack,
  Typography,
  IconButton,
  Tooltip
} from "@mui/material";
import FlipIcon from '@mui/icons-material/Flip';
import { AddCircleOutline } from "@mui/icons-material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Span } from "app/components/Typography";
import { useDropzone } from "react-dropzone";
import { predictImage, submitFormData, submitImageAndPrediction } from "app/apis/broiler_api";
import { SimpleCard } from "app/components";
import useAuth from "app/hooks/useAuth";
import { PredictionResult, AbnormalityDetection } from "./PredictionResult";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import useAppContext from "app/hooks/useAppContext";
import PhysicianDecisionDialog from "./PhysicianDecisionDialog";
import React, { useEffect, useState } from "react";
const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
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
};

const diagnosisLabels = {
  0: "Newcastle",
  1: "Normal",
  2: "Other abnormal"
};

const getLargestIndex = (predictionArray) => predictionArray.indexOf(Math.max(...predictionArray));
const isPredictionValid = (predictionArray) => Array.isArray(predictionArray) && predictionArray.length > 0;

const BroilerForm = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageSection, setShowImageSection] = useState(false);
  const [res, setRes] = useState({});
  const { user } = useAuth();
  const farm_institution = JSON.parse(localStorage.getItem("health_institution"))?.id;
  const { state, dispatch } = useAppContext();

  // FIXED: Removed duplicate broiler_id key
  const [predictions, setPredictions] = useState({
    broiler_id: state.new_screening ? state.currentBroilerId : null,
    broiler_image: null,
    image_prediction: null,
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
    supervisor_id: user?.id || "",
    farm_institution: farm_institution || "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);
  const handleChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const imageFiles = acceptedFiles.filter((file) => file.type.startsWith("image/"));
      if (imageFiles.length > 0) setImagePreview(imageFiles[0]);
    },
  });

  // const handleShowImageSection = async () => {
  //   try {
  //     const response = await submitFormData(formData);
  //     if (response && response.id) {
  //       setPredictions((prev) => ({ ...prev, broiler_id: response.id }));
  //       setShowImageSection(true);
  //     } else {
  //       alert("The server did not return a Broiler ID.");
  //     }
  //   } catch (error) {
  //     console.error("Error saving broiler data:", error);
  //   }
  // };
  const handleShowImageSection = async () => {
    // FORCE the supervisor_id right now
    const finalData = {
      ...formData,
      supervisor_id: user?.id || formData.supervisor_id
    };

    // STOP if ID is missing
    if (!finalData.supervisor_id) {
      alert("User ID missing. Please refresh and log in again.");
      return;
    }

    try {
      const response = await submitFormData(finalData); // Send finalData, NOT formData
      if (response && response.id) {
        setPredictions((prev) => ({ ...prev, broiler_id: response.id }));
        setShowImageSection(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDiagnose = async () => {
    if (!imagePreview) {
      alert("Please provide an image for diagnosis.");
      return;
    }

    const b_id = predictions.broiler_id;
    if (!b_id || b_id === "undefined") {
      alert("Error: Broiler ID is missing. Please save details first.");
      return;
    }

    setIsLoading(true);
    try {
      const prediction = await predictImage(imagePreview, b_id);
      if (prediction && isPredictionValid(prediction?.predictions[0])) {
        const finalPredictions = {
          ...predictions,
          image_prediction: diagnosisLabels[getLargestIndex(prediction?.predictions[0])],
          broiler_image: prediction?.broiler_image,
        };
        const response = await submitImageAndPrediction(finalPredictions);
        setPredictions(prev => ({ ...prev, image_prediction: prediction.predictions, broiler_image: prediction.broiler_image }));
        setRes(response);
      }
    } catch (error) {
      console.error("Diagnosis error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      {!showImageSection ? (
        <ValidatorForm onSubmit={handleShowImageSection}>
          <Stack spacing={3}>
            {/* CARD 1: FARMER INFO */}
            <SimpleCard title="Farmer & Farm Information">
              <Grid container spacing={3}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <TextField label="Farmer Name" name="farmer_name" onChange={handleChange} value={formData.farmer_name} validators={["required"]} errorMessages={["required"]} />
                  <TextField label="Farm Name" name="farm_name" onChange={handleChange} value={formData.farm_name} />
                  <TextField label="Phone Number" name="Phone_Number" onChange={handleChange} value={formData.Phone_Number} />
                  <TextField label="Email" name="email" onChange={handleChange} value={formData.email} />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <TextField label="Region" name="region" onChange={handleChange} value={formData.region} />
                  <TextField label="Zone" name="zone" onChange={handleChange} value={formData.zone} />
                  <TextField label="Kebele" name="kebele" onChange={handleChange} value={formData.kebele} />
                </Grid>
              </Grid>
            </SimpleCard>

            {/* CARD 2: BROILER INFO */}
            <SimpleCard title="Broiler Unit Details">
              <Grid container spacing={3}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <TextField label="Breed" name="breed" onChange={handleChange} value={formData.breed} validators={["required"]} />
                  <TextField label="Flock ID" name="Flock_ID" onChange={handleChange} value={formData.Flock_ID} />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <TextField type="date" label="Hatch Date" name="hatch_date" onChange={handleChange} value={formData.hatch_date} />
                </Grid>
              </Grid>
            </SimpleCard>

            <Button variant="contained" type="submit" sx={{ bgcolor: '#181b62', width: '200px', alignSelf: 'flex-start' }}>
              Save and Continue
            </Button>
          </Stack>
        </ValidatorForm>
      ) : (
        <SimpleCard title="Diagnosis & Results">
          <Grid container spacing={2}>
            <Grid item lg={8} xs={12}>
              <div {...getRootProps()} style={dropzoneStyle}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop fecal image here</p>
              </div>
              {imagePreview && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="subtitle1">Broiler Fecal Image</Typography>
                  <Zoom>
                    <img src={URL.createObjectURL(imagePreview)} alt="Preview" style={{ width: "100%", maxHeight: "300px", objectFit: 'contain' }} />
                  </Zoom>
                </Box>
              )}
            </Grid>
            <Grid item lg={4} xs={12}>
              <Button fullWidth variant="contained" onClick={handleDiagnose} disabled={isLoading} sx={{ bgcolor: '#181b62', mb: 2 }}>
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Run Diagnosis"}
              </Button>

              <Box sx={{ p: 2, border: '1px dashed #181b62', borderRadius: '5px' }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FlipIcon sx={{ color: '#fa931d', mr: 1 }} /> Result
                  {predictions.image_prediction && (
                    <IconButton onClick={handleOpenDialog} size="small"><AddCircleOutline sx={{ color: "red" }} /></IconButton>
                  )}
                </Typography>

                {predictions.image_prediction && (
                  <>
                    <AbnormalityDetection data={predictions.image_prediction[0]} />
                    <PredictionResult data={predictions.image_prediction[0]} />
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
          <PhysicianDecisionDialog open={dialogOpen} onClose={handleCloseDialog} Result={res} />
        </SimpleCard>
      )}
    </Container>
  );
};

export default BroilerForm;