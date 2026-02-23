// import React, { useState, useEffect } from "react";
// import Tooltip from "@mui/material/Tooltip";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ArrowBack from "@mui/icons-material/ArrowBack";
// import Fade from "@mui/material/Fade";

// import {
//   Box,
//   Table,
//   TableRow,
//   TableBody,
//   TableCell,
//   TableHead,
//   IconButton,
//   TablePagination,
//   Typography,
//   Accordion,
//   AccordionSummary,
// } from "@mui/material";

// import { Grid } from "@material-ui/core";
// import { Stack, styled } from "@mui/system";

// import BroilersRecordCard from "../BroilersRecordCard";
// import { fetchBroilerForSupervisor, fetchBroiler } from "app/apis/broiler_api";
// import useAppContext from "app/hooks/useAppContext";
// import useAuth from "app/hooks/useAuth";
// import BroilerProfile from "./BroilerProfile";
// import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

// const Container = styled("div")(({ theme }) => ({
//   margin: "30px",
//   [theme.breakpoints.down("sm")]: { margin: "16px" },
//   "& .breadcrumb": {
//     marginBottom: "30px",
//     [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
//   }
// }));

// const StyledTable = styled(Table)(() => ({
//   whiteSpace: "pre",
//   "& thead": {
//     "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
//   },
//   "& tbody": {
//     "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
//   },
// }));

// const BroilerRecord = () => {
//   const [expanded, setExpanded] = useState(false);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [broilers, setBroilers] = useState([]);
//   const [broiler, setBroiler] = useState(null);
//   const [viewBroiler, setViewBroiler] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const { state } = useAppContext();
//   const supervisor = useAuth();

//   const handleExpansion = () => {
//     setExpanded(prev => !prev);
//   };

//   const handleBack = () => {
//     setViewBroiler(false);
//   };

//   useEffect(() => {
//     const fetchBroilers = async () => {
//       try {
//         const data = await fetchBroilerForSupervisor(
//           supervisor?.user?.farm_institution?.id
//         );
//         console.log("API DATA:", data);
//         setBroilers(data || []);
//       } catch (error) {
//         console.error("Error fetching broilers:", error);
//       }
//     };
//     fetchBroilers();
//   }, []);

//   const handleBroilerView = async (userId) => {
//     try {
//       const data = await fetchBroiler(userId);
//       setBroiler(data);
//       setViewBroiler(true);
//     } catch (e) {
//       console.error("Error fetching broiler", e);
//     }
//   };

//   const handleChangePage = (_, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };
//   // const filteredBroiler = broilers?.filter((broiler) => {
//   //   const query = searchQuery.toLowerCase();
//   //   // const filteredBroiler = broilers?.filter((broiler) =>
//   //   // String(broiler?.farmer_name + broiler?.farm_name)?.toLowerCase().includes(searchQuery.toLowerCase())
//   //   // );
//   //   return (
//   //     broiler?.farmer_name?.toLowerCase().includes(query) ||
//   //     broiler?.farm_name?.toLowerCase().includes(query) ||
//   //     broiler?.breed?.toLowerCase().includes(query) ||
//   //     String(broiler?.image_id).includes(query) ||
//   //     broiler?.record_date?.toLowerCase().includes(query)
//   //   );
//   // });
//   return (
//     <Container>
//       <Stack spacing={3}>
//         <BroilersRecordCard title="Broilers Record">
//           {!viewBroiler ? (
//             <Box width="100%" overflow="auto">
//               <StyledTable>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell align="center">
//                       <ValidatorForm>
//                         <TextValidator
//                           label="Search(Farmer,Farm,,Breed,ID)"
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                           name="id"
//                           value={searchQuery}
//                         // validators={['required']}
//                         // errorMessages={['this field is required']}
//                         />
//                       </ValidatorForm>
//                     </TableCell>
//                     <TableCell align="center">Farmer</TableCell>
//                     <TableCell align="center">Breed</TableCell>
//                     <TableCell align="center">Registered</TableCell>
//                     <TableCell align="center">Image ID</TableCell>
//                     <TableCell align="center">Action</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {/* {filteredBroiler
//                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                     .map((broiler, index) => (
//                       <TableRow key={broiler?.id}>
//                         <TableCell align="left">
//                           {broiler?.farmer_name} — {broiler?.farm_name}
//                         </TableCell>
//                         <TableCell align="center">{broiler?.breed}</TableCell>
//                         <TableCell align="center">{broiler?.record_date}</TableCell>
//                         <TableCell align="center">{broiler?.image_id}</TableCell>
//                         <TableCell align="center">
//                           <Tooltip title="View"> */}
//                   <IconButton
//                     onClick={() => handleBroilerView(broiler?.id)}
//                     sx={{ "&:hover": { bgcolor: "grey.200" } }}
//                   >
//                     <VisibilityIcon sx={{ color: "#fa931d" }} />
//                   </IconButton>
//                 </Tooltip>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </StyledTable>

//       <TablePagination
//         sx={{ px: 2 }}
//         page={page}
//         component="div"
//         rowsPerPage={rowsPerPage}
//         // count={filteredBroiler.length}
//         onPageChange={handleChangePage}
//         rowsPerPageOptions={[5, 10, 25]}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//         nextIconButtonProps={{ "aria-label": "Next Page" }}
//         backIconButtonProps={{ "aria-label": "Previous Page" }}
//       />
//     </Box>
//   ) : (
//     <>
//       <Accordion
//         expanded={expanded}
//         onChange={handleExpansion}
//         slots={{ transition: Fade }}
//         slotProps={{ transition: { timeout: 400 } }}
//         sx={[
//           expanded
//             ? {
//               '& .MuiAccordion-region': { height: 'auto' },
//               '& .MuiAccordionDetails-root': { display: 'block' },
//             }
//             : {
//               '& .MuiAccordion-region': { height: 0 },
//               '& .MuiAccordionDetails-root': { display: 'none' },
//             },
//         ]}
//       >
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls="panel1-content"
//           id="panel1-header"
//         >
//           <Box display="flex" alignItems="center" gap={2}>
//             <Tooltip title="Back">
//               <IconButton
//                 onClick={handleBack}
//                 sx={{ "&:hover": { bgcolor: "grey.200", color: "#7c80f1" } }}
//               >
//                 <ArrowBack sx={{ color: "#fa931d" }} />
//               </IconButton>
//             </Tooltip>
//             <Typography variant="h8" sx={{ fontStyle: "bold" }}>
//               {`${broiler?.farmer_name} ${broiler?.farm_name}`.toUpperCase()}
//             </Typography>
//           </Box>
//         </AccordionSummary>
//         <AccordionDetails>
//           <Box sx={{ p: 2, border: '1px dashed blue', borderRadius: '5px', marginBottom: 2, boxShadow: 5 }}>
//             <Grid container spacing={2} justifyContent="flex">
//               <Grid item xs={12} sm={6} md={6} lg={6}>
//                 <Typography variant="subtitle1" align="left" gutterBottom>
//                   {`${broiler?.breed}, ${broiler?.hatch_date}`}
//                 </Typography>
//                 <Typography variant="subtitle1" align="left" gutterBottom>
//                   {`Email: ${broiler?.email}`}
//                 </Typography>
//                 <Typography variant="subtitle1" align="left" gutterBottom>
//                   {`Flock ID: ${broiler?.Flock_ID}`}
//                 </Typography>
//               </Grid>
//               <Grid item xs={12} sm={6} md={6} lg={6}>
//                 <Typography variant="subtitle1" align="left" gutterBottom>
//                   {`Region: ${broiler?.region}`}
//                 </Typography>
//                 <Typography variant="subtitle1" align="left" gutterBottom>
//                   {`Zone: ${broiler?.zone}`}
//                 </Typography>
//                 <Typography variant="subtitle1" align="left" gutterBottom>
//                   {`Kebele: ${broiler?.kebele}`}
//                 </Typography>
//                 <Typography variant="subtitle1" align="left" gutterBottom>
//                   {`Registered Date: ${broiler?.record_date}`}
//                 </Typography>
//               </Grid>
//             </Grid>
//           </Box>
//         </AccordionDetails>
//       </Accordion>
//       {broiler && <BroilerProfile data={broiler} />}
//     </>
//   )
// }
//         </BroilersRecordCard >
//       </Stack >
//     </Container >
//   );
// };

// export default BroilerRecord;


// import React, { useState, useEffect, useMemo } from "react";
// import Tooltip from "@mui/material/Tooltip";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ArrowBack from "@mui/icons-material/ArrowBack";
// import Fade from "@mui/material/Fade";

// import {
//   Box,
//   Table,
//   TableRow,
//   TableBody,
//   TableCell,
//   TableHead,
//   IconButton,
//   TablePagination,
//   Typography,
//   Accordion,
//   AccordionSummary,
// } from "@mui/material";

// import { Grid } from "@material-ui/core";
// import { Stack, styled } from "@mui/system";

// import BroilersRecordCard from "../BroilersRecordCard";
// import { fetchBroilerForSupervisor, fetchBroiler } from "app/apis/broiler_api";
// import useAuth from "app/hooks/useAuth";
// import BroilerProfile from "./BroilerProfile";
// // import { TextValidator } from "react-material-ui-form-validator";
// import TextField from "@mui/material/TextField";
// const Container = styled("div")(({ theme }) => ({
//   margin: "30px",
//   [theme.breakpoints.down("sm")]: { margin: "16px" },
// }));

// const StyledTable = styled(Table)(() => ({
//   whiteSpace: "pre",
// }));

// const BroilerRecord = () => {
//   const [expanded, setExpanded] = useState(false);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const [broilers, setBroilers] = useState([]);
//   const [broiler, setBroiler] = useState(null);
//   const [viewBroiler, setViewBroiler] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const supervisor = useAuth();

//   // ================= FETCH =================
//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await fetchBroilerForSupervisor(
//         supervisor?.user?.farm_institution?.id
//       );
//       setBroilers(data || []);
//     };
//     fetchData();
//   }, []);

//   // ================= SEARCH FILTER =================
//   const filteredBroiler = useMemo(() => {
//     const query = searchQuery.toLowerCase();

//     return broilers.filter((b) =>
//       (
//         `${b.farmer_name} ${b.farm_name} ${b.breed} ${b.image_id} ${b.record_date}`
//       )
//         .toLowerCase()
//         .includes(query)
//     );
//   }, [broilers, searchQuery]);

//   // ================= HANDLERS =================
//   const handleBroilerView = async (id) => {
//     const data = await fetchBroiler(id);
//     setBroiler(data);
//     setViewBroiler(true);
//   };

//   const handleBack = () => setViewBroiler(false);

//   // ================= UI =================
//   return (
//     <Container>
//       <Stack spacing={3}>
//         <BroilersRecordCard title="Broilers Record">
//           {!viewBroiler ? (
//             <Box width="100%" overflow="auto">

//               {/* SEARCH */}
//               <Box mb={2}>
//                 <TextField
//                   fullWidth
//                   label="Search (Farmer, Farm, Breed, ID...)"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </Box>

//               {/* TABLE */}
//               <StyledTable>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Farmer - Farm</TableCell>
//                     <TableCell align="center">Breed</TableCell>
//                     <TableCell align="center">Registered</TableCell>
//                     <TableCell align="center">Image ID</TableCell>
//                     <TableCell align="center">Action</TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {filteredBroiler
//                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                     .map((b) => (
//                       <TableRow key={b.id}>
//                         <TableCell>
//                           {b.farmer_name} — {b.farm_name}
//                         </TableCell>

//                         <TableCell align="center">{b.breed}</TableCell>
//                         <TableCell align="center">{b.record_date}</TableCell>
//                         <TableCell align="center">{b.id}</TableCell>

//                         <TableCell align="center">
//                           <Tooltip title="View">
//                             <IconButton onClick={() => handleBroilerView(b.id)}>
//                               <VisibilityIcon sx={{ color: "#fa931d" }} />
//                             </IconButton>
//                           </Tooltip>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                 </TableBody>
//               </StyledTable>

//               {/* PAGINATION */}
//               <TablePagination
//                 component="div"
//                 page={page}
//                 rowsPerPage={rowsPerPage}
//                 count={filteredBroiler.length}
//                 onPageChange={(_, newPage) => setPage(newPage)}
//                 onRowsPerPageChange={(e) => {
//                   setRowsPerPage(+e.target.value);
//                   setPage(0);
//                 }}
//               />
//             </Box>
//           ) : (
//             <>
//               <Accordion expanded onChange={() => setExpanded(!expanded)}>
//                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                   <Tooltip title="Back">
//                     <IconButton onClick={handleBack}>
//                       <ArrowBack />
//                     </IconButton>
//                   </Tooltip>
//                   <Typography sx={{ ml: 2 }}>
//                     {`${broiler?.farmer_name} ${broiler?.farm_name}`}
//                   </Typography>
//                 </AccordionSummary>

//                 <AccordionDetails>
//                   <Grid container spacing={2}>
//                     <Grid item xs={6}>
//                       <Typography>{broiler?.breed}</Typography>
//                       <Typography>{broiler?.email}</Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography>{broiler?.region}</Typography>
//                       <Typography>{broiler?.record_date}</Typography>
//                     </Grid>
//                   </Grid>
//                 </AccordionDetails>
//               </Accordion>

//               {broiler && <BroilerProfile data={broiler} />}
//             </>
//           )}
//         </BroilersRecordCard>
//       </Stack>
//     </Container>
//   );
// };

// export default BroilerRecord;


import React, { useState, useEffect, useMemo } from "react";
import Tooltip from "@mui/material/Tooltip";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Fade from "@mui/material/Fade";
import TextField from "@mui/material/TextField";

import {
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TablePagination,
  Typography,
  Accordion,
  AccordionSummary,
} from "@mui/material";

import { Grid } from "@material-ui/core";
import { Stack, styled } from "@mui/system";

import BroilersRecordCard from "../BroilersRecordCard";
import { fetchBroilerForSupervisor, fetchBroiler } from "app/apis/broiler_api";
import useAuth from "app/hooks/useAuth";
import BroilerProfile from "./BroilerProfile";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
}));

const BroilerRecord = () => {
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [broilers, setBroilers] = useState([]);
  const [broiler, setBroiler] = useState(null);
  const [viewBroiler, setViewBroiler] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const supervisor = useAuth();

  // 1. FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBroilerForSupervisor(
          supervisor?.user?.farm_institution?.id
        );
        setBroilers(data || []);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };
    fetchData();
  }, [supervisor]);

  // 2. RESET PAGE ON SEARCH (Very Important!)
  // If you are on page 5 and search for something that has 1 result, 
  // the table will look empty unless you move back to page 0.
  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  // 3. IMPROVED SEARCH FILTER
  const filteredBroiler = useMemo(() => {
    if (!searchQuery) return broilers;

    const query = searchQuery.toLowerCase();

    return broilers.filter((b) => {
      // We use optional chaining and empty strings to prevent errors if data is missing
      const farmer = (b?.farmer_name || "").toLowerCase();
      const farm = (b?.farm_name || "").toLowerCase();
      const breed = (b?.breed || "").toLowerCase();
      const id = String(b?.id || "").toLowerCase();
      const date = (b?.record_date || "").toLowerCase();

      return (
        farmer.includes(query) ||
        farm.includes(query) ||
        breed.includes(query) ||
        id.includes(query) ||
        date.includes(query)
      );
    });
  }, [broilers, searchQuery]);

  // 4. HANDLERS
  const handleBroilerView = async (id) => {
    const data = await fetchBroiler(id);
    setBroiler(data);
    setViewBroiler(true);
  };

  const handleBack = () => setViewBroiler(false);

  return (
    <Container>
      <Stack spacing={3}>
        <BroilersRecordCard title="Broilers Record">
          {!viewBroiler ? (
            <Box width="100%" overflow="auto">

              {/* SEARCH BOX */}
              <Box mb={2} px={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Search (Farmer, Farm, Breed, ID...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Box>

              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell>Farmer - Farm</TableCell>
                    <TableCell align="center">Breed</TableCell>
                    <TableCell align="center">Registered</TableCell>
                    <TableCell align="center">Image ID</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredBroiler.length > 0 ? (
                    filteredBroiler
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((b) => (
                        <TableRow key={b.id}>
                          <TableCell>
                            {b.farmer_name} — {b.farm_name}
                          </TableCell>
                          <TableCell align="center">{b.breed}</TableCell>
                          <TableCell align="center">{b.record_date}</TableCell>
                          <TableCell align="center">{b.id}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="View">
                              <IconButton onClick={() => handleBroilerView(b.id)}>
                                <VisibilityIcon sx={{ color: "#fa931d" }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    /* 5. ADDED NO RESULTS MESSAGE */
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography sx={{ py: 3 }} color="textSecondary">
                          No records found matching "{searchQuery}"
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </StyledTable>

              <TablePagination
                component="div"
                page={page}
                rowsPerPage={rowsPerPage}
                count={filteredBroiler.length}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(+e.target.value);
                  setPage(0);
                }}
              />
            </Box>
          ) : (
            /* VIEW DETAIL MODE */
            <>
              <Accordion expanded onChange={() => setExpanded(!expanded)}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center">
                    <Tooltip title="Back">
                      <IconButton onClick={handleBack}>
                        <ArrowBack sx={{ color: "#fa931d" }} />
                      </IconButton>
                    </Tooltip>
                    <Typography sx={{ ml: 2, fontWeight: 'bold' }}>
                      {`${broiler?.farmer_name} ${broiler?.farm_name}`.toUpperCase()}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography><strong>Breed:</strong> {broiler?.breed}</Typography>
                      <Typography><strong>Email:</strong> {broiler?.email}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography><strong>Region:</strong> {broiler?.region}</Typography>
                      <Typography><strong>Date:</strong> {broiler?.record_date}</Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
              {broiler && <BroilerProfile data={broiler} />}
            </>
          )}
        </BroilersRecordCard>
      </Stack>
    </Container>
  );
};

export default BroilerRecord;