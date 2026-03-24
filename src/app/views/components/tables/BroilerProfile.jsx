// import React, { useState, useEffect } from "react";
// import { Card, CardContent } from "@material-ui/core";
// import { makeStyles } from "@material-ui/core/styles";
// import VisibilityIcon from "@mui/icons-material/Visibility";

// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import { fetchBroilerById } from "app/apis/broiler_api";
// import {
//   Box,
//   Table,
//   TableRow,
//   TableBody,
//   TableCell,
//   TableHead,
//   TablePagination,
//   Dialog,
//   DialogContent,
//   IconButton,
//   Tooltip,
// } from "@mui/material";
// import { styled } from "@mui/system";
// import CloseIcon from "@mui/icons-material/Close";
// import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
// import BroilerForm from "../forms/BroilerForm";

// import { useNavigate } from 'react-router-dom';
// import useAppContext, { AppContext } from "app/hooks/useAppContext";
// import { getUser } from "app/apis/users_api";

// const StyledTable = styled(Table)(() => ({
//   whiteSpace: "pre",
//   "& thead": {
//     "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
//   },
//   "& tbody": {
//     "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
//   },
// }));

// const useStyles = makeStyles((theme) => ({
//   card: {
//     maxWidth: "100%",
//     margin: "auto",
//     marginTop: theme.spacing(3),
//     marginBottom: theme.spacing(3),
//   },
//   image: {
//     width: "100%",
//     height: "auto",
//     maxHeight: "200px",
//   },
// }));

// const ZoomImage = ({ imageUrl, onClose }) => {
//   // console.log("Image Url:", imageUrl)
//   return (
//     <Dialog open={Boolean(imageUrl)} onClose={onClose} maxWidth="lg">
//       <DialogContent>
//         <IconButton
//           edge="start"
//           color="inherit"
//           onClick={onClose}
//           aria-label="close"
//           style={{ position: "absolute", right: 16, top: 16 }}
//         >
//           <CloseIcon />
//         </IconButton>
//         {imageUrl && (
//           <img
//             src={imageUrl}
//             alt="Enlarged"
//             style={{ width: "100%", height: "auto" }}
//           />
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };

// // MAIN COMPONENT
// const BroilerProfile = ({ data }) => {
//   const { state, dispatch } = useAppContext()
//   const navigate = useNavigate();
//   const classes = useStyles();
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [broilers, setBroilers] = useState([]);
//   const [zoomedImageUrl, setZoomedImageUrl] = useState(null);
//   const [supervisorDetails, setsupervisorDetails] = useState({});

//   // useEffect(() => {
//   //   const fetchBroilers = async () => {
//   //     try {
//   //       const broilerData = await fetchBroilerById(data.id);
//   //       setBroilers(broilerData);

//   //       const uniquesupervisorIds = [...new Set(broilerData?.map(broiler => broiler?.supervisor_id))];
//   //       const supervisorPromises = uniquesupervisorIds?.map(supervisorId => getUser(supervisorId));

//   //       const supervisors = await Promise.all(supervisorPromises);
//   //       const supervisorDetailsMap = {};
//   //       uniquesupervisorIds?.forEach((supervisorId, index) => {
//   //         supervisorDetailsMap[supervisorId] = supervisors[index];
//   //       });
//   //       setsupervisorDetails(supervisorDetailsMap);
//   //     } catch (error) {
//   //       console.error("Error fetching broilers:", error);
//   //     }
//   //   };

//   //   fetchBroilers();
//   // }, [data]);
//   useEffect(() => {
//     // console.log("Updated supervisor details:", supervisorDetails);
//   }, [supervisorDetails]);

//   const [searchQuery, setSearchQuery] = useState('');
//   const filteredBroiler = broilers?.filter((broiler) =>
//     String(broiler?.record_date).toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleChangePage = (_, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };
//   const handleNewScreening = (id) => {
//     dispatch({ type: 'START_NEW_SCREENING', payload: id });
//     navigate('/newcase/')
//   };
//   // MEDIA BASE URL
//   const mediaBaseUrl = `${process.env.REACT_APP_SERVER_IP_ADDRESS}/media/raw/`;
//   return (
//     <>
//       <CardContent>
//         <Box width="100%" overflow="auto">
//           <StyledTable>
//             <TableHead>
//               <TableRow>
//                 <TableCell align="center">
//                   <ValidatorForm>
//                     <TextValidator
//                       label="Date"
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       name="id"
//                       value={searchQuery}
//                       validators={['required']}
//                       errorMessages={['this field is required']}
//                     />
//                   </ValidatorForm>
//                 </TableCell>
//                 <TableCell align="center" colSpan={2}>Image
//                   <IconButton
//                     // onClick={() => handleNewScreening(data.id)}
//                     sx={{ align: "right", "&:hover": { bgcolor: "grey.200" } }}
//                   >
//                     <AddCircleIcon sx={{ color: "#fa931d" }} />
//                   </IconButton>
//                 </TableCell>
//                 <TableCell align="center" >supervisor</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredBroiler
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((broiler, index) => (
//                   <TableRow key={index}>
//                     <TableCell align="left">
//                       {broiler?.record_date}
//                     </TableCell>
//                     <TableCell align="center">{broiler?.record_date}</TableCell>
//                     <TableCell align="center">
//                       <Tooltip title="View Image">
//                         <span
//                           style={{ cursor: "pointer", color: broiler?.broiler_image ? "#181b62" : "gray" }}
//                           onClick={() => {
//                             if (broiler.broiler_image) {
//                               const ImageName = broiler?.broiler_image?.split('\\').pop();
//                               // console.log(ImageName)
//                               setZoomedImageUrl(`${mediaBaseUrl}${ImageName}`);
//                             }
//                           }}
//                         >
//                           <VisibilityIcon sx={{ color: broiler?.broiler_image ? "#181b62" : "gray" }} />
//                         </span>
//                       </Tooltip>
//                     </TableCell>
//                     <TableCell align="center">
//                       {supervisorDetails[broiler.supervisor_id] ? (
//                         <>
//                           {supervisorDetails[broiler?.supervisor_id]?.farmer_name} {supervisorDetails[broiler?.supervisor_id].farm_name}
//                         </>
//                       ) : (
//                         <p>Loading supervisor details...</p>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//             </TableBody>

//           </StyledTable>


//           <TablePagination
//             sx={{ px: 2 }}
//             page={page}
//             component="div"
//             rowsPerPage={rowsPerPage}
//             count={filteredBroiler.length}
//             onPageChange={handleChangePage}
//             rowsPerPageOptions={[5, 10, 25]}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//             nextIconButtonProps={{ "aria-label": "Next Page" }}
//             backIconButtonProps={{ "aria-label": "Previous Page" }}
//           />
//         </Box>
//       </CardContent>
//       <ZoomImage imageUrl={zoomedImageUrl} onClose={() => setZoomedImageUrl(null)} />
//     </>
//   );
// };

// export default BroilerProfile;
import React, { useState, useEffect } from "react";
import { CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { fetchBroilerById } from "app/apis/broiler_api";
import {
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useNavigate } from 'react-router-dom';
import useAppContext from "app/hooks/useAppContext";
import { getUser } from "app/apis/users_api";

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 10, paddingRight: 10 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 10, textTransform: "capitalize" } },
  },
}));

const ZoomImage = ({ imageUrl, onClose }) => {
  return (
    <Dialog open={Boolean(imageUrl)} onClose={onClose} maxWidth="lg">
      <DialogContent sx={{ position: 'relative', p: 0 }}>
        <IconButton
          onClick={onClose}
          style={{ position: "absolute", right: 8, top: 8, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <CloseIcon />
        </IconButton>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Enlarged"
            style={{ width: "100%", height: "auto", display: 'block' }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

const BroilerProfile = ({ data }) => {
  console.log("BroilerProfile Rendered", data);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [broilers, setBroilers] = useState([]); // This stores your data
  const [zoomedImageUrl, setZoomedImageUrl] = useState(null);
  const [supervisorDetails, setSupervisorDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!data?.id) return;
      try {
        const broilerData = await fetchBroilerById(data.id);

        const broilerList = Array.isArray(broilerData)
          ? broilerData
          : broilerData?.broilers || broilerData?.results || [];

        setBroilers(broilerList);
      } catch (error) {
        console.error("Error loading profile data:", error);
      }
    };
    loadData();
  }, [data]);

  // const filteredBroiler = Array.isArray(broilers)
  //   ? broilers.filter((broiler) =>
  //     String(broiler?.record_date || broiler?.image_prediction).toLowerCase().includes(searchQuery.toLowerCase())
  //   )
  //   : [];
  const filteredBroiler = broilers.filter(
    item => item.broiler_image
  );


  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // // URL Logic: Ensure REACT_APP_SERVER_IP_ADDRESS is correct in your .env file
  // const mediaBaseUrl = `${process.env.REACT_APP_SERVER_IP_ADDRESS}/media/raw/`;

  // const handleShowImage = (imagePath) => {
  //   if (imagePath) {
  //     const imageName = imagePath.split('\\').pop().split('/').pop();
  //     setZoomedImageUrl(`${mediaBaseUrl}${imageName}`);
  //   }
  // };
  // 1. Change the Base URL to just the Server IP (No extra folders)
  const mediaBaseUrl = process.env.REACT_APP_SERVER_IP_ADDRESS;

  const handleShowImage = (imagePath) => {
    if (imagePath) {
      // 2. STOP splitting the path. 
      // Use the full 'imagePath' provided by the database.
      setZoomedImageUrl(`${mediaBaseUrl}${imagePath}`);
    }
  };

  return (
    <>
      <CardContent>
        <Box width="100%" overflow="auto">
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell align="left">Date</TableCell>
                <TableCell align="center">Prediction Result</TableCell>
                <TableCell align="center">Broiler Image</TableCell>
                <TableCell align="center">Image ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBroiler.length > 0 ? (
                filteredBroiler
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">{item?.record_date || "N/A"}</TableCell>

                      {/* Prediction Result Column */}
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#fa931d' }}>
                          {item?.image_prediction || "Pending..."}
                        </Typography>
                      </TableCell>

                      {/* Image Column */}
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                          {item?.broiler_image ? (
                            <img
                              /* CORRECTED : We use the full path from item.broiler_image */
                              src={`${mediaBaseUrl}${item.broiler_image}`}
                              alt="broiler"
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: 4,
                                objectFit: 'cover',
                                cursor: 'pointer',
                                border: '1px solid #ddd'
                              }}
                              onClick={() => handleShowImage(item.broiler_image)}
                              /* If the image fails, this shows a placeholder so you know it's a path error */
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/50?text=Error";
                              }}
                            />
                          ) : (
                            <Typography variant="caption" color="textSecondary">No Image</Typography>
                          )}

                          <IconButton onClick={() => handleShowImage(item?.broiler_image)}>
                            <VisibilityIcon sx={{ color: item?.broiler_image ? "#181b62" : "#ccc" }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {data?.id ?? "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">No records found for this broiler.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </StyledTable>

          <TablePagination
            sx={{ px: 2 }}
            page={page}
            component="div"
            rowsPerPage={rowsPerPage}
            count={filteredBroiler.length}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </CardContent>
      <ZoomImage imageUrl={zoomedImageUrl} onClose={() => setZoomedImageUrl(null)} />
    </>
  );
};

export default BroilerProfile;