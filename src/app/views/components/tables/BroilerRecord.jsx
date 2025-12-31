import React, { useState, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Fade from "@mui/material/Fade";

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

import BroilersRecordCard from "../BroilersRecordCard"; // ✅ correct
import { fetchBroilerForSupervisor, fetchBroiler } from "app/apis/broiler_api";
import useAppContext from "app/hooks/useAppContext";
import useAuth from "app/hooks/useAuth";
import BroilerProfile from "./BroilerProfile";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));
const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const BroilerRecord = () => {

  const [expanded, setExpanded] = React.useState(false);

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };
  const [page, setPage] = useState(0);
  const { state } = useAppContext();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [broilers, setBroilers] = useState([]);
  const [broiler, setBroiler] = useState(null);
  const [viewBroiler, setViewBroiler] = useState(false);
  const supervisor = useAuth();

  console.log("supervisor", supervisor);
  useEffect(() => {
    const fetchBroilers = async () => {
      try {
        const broilerData = await fetchBroilerForSupervisor(supervisor?.user?.farm_institution?.id);
        setBroilers(broilerData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchBroilers();
  }, []);

  const handleBroilerView = async (userId) => {
    try {
      const data = await fetchBroiler(userId);
      setBroiler(data);
      setViewBroiler(true);
    } catch (e) {
      console.error("Error fetching broiler", e);
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const Severity = {
    0: "NO DR",
    1: "NPDR",
    2: "PLDR",
  };


  const largestIndex = (predictions) => {
    if (!predictions || predictions.length === 0 || predictions[0].length === 0) {
      return -1;
    }

    let largestIndex = 0;

    for (let i = 1; i < predictions[0].length; i++) {
      if (predictions[0][i] > predictions[0][largestIndex]) {
        largestIndex = i;
      }
    }

    return largestIndex;
  };


  const handleBack = () => {
    setViewBroiler(false);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const filteredBroiler = broilers?.filter((broiler) =>
    String(broiler?.farmer_name + broiler?.farm_name)?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // console.log("broiler filtered", filteredBroiler);  
  return (
    <Container>
      <Stack spacing={3}>
        <BroilersRecordCard title="Broilers Record">
          {!viewBroiler ? (
            <Box width="100%" overflow="auto">
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">

                      <ValidatorForm>
                        <TextValidator
                          label="Broiler Name"
                          onChange={(e) => setSearchQuery(e.target.value)}
                          name="id"
                          value={searchQuery}
                          validators={['required']}
                          errorMessages={['this field is required']}
                        />
                      </ValidatorForm>
                    </TableCell>
                    <TableCell align="center">Phone_Number</TableCell>
                    <TableCell align="center">Breed</TableCell>
                    <TableCell align="center">Registered</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBroiler
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((broiler, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">
                          {broiler?.farmer_name + " " + broiler?.farm_name}
                        </TableCell>
                        <TableCell align="center">{broiler?.phone_number}</TableCell>
                        <TableCell align="center">
                          {broiler?.breed}
                        </TableCell><TableCell align="center">
                          {broiler?.record_date}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View">
                            <IconButton
                              onClick={() => handleBroilerView(broiler?.id)}
                              sx={{ "&:hover": { bgcolor: "grey.200" } }}
                            >
                              <VisibilityIcon sx={{ color: "#fa931d" }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
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
                nextIconButtonProps={{ "aria-label": "Next Page" }}
                backIconButtonProps={{ "aria-label": "Previous Page" }}
              />
            </Box>

          ) : (
            <>
              <Accordion
                expanded={expanded}
                onChange={handleExpansion}
                slots={{ transition: Fade }}
                slotProps={{ transition: { timeout: 400 } }}
                sx={[
                  expanded
                    ? {
                      '& .MuiAccordion-region': {
                        height: 'auto',
                      },
                      '& .MuiAccordionDetails-root': {
                        display: 'block',
                      },
                    }
                    : {
                      '& .MuiAccordion-region': {
                        height: 0,
                      },
                      '& .MuiAccordionDetails-root': {
                        display: 'none',
                      },
                    },
                ]}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Tooltip title="Back">
                      <IconButton
                        onClick={handleBack}
                        sx={{ "&:hover": { bgcolor: "grey.200", color: "#7c80f1" } }}
                      >
                        <ArrowBack sx={{ color: "#fa931d" }} />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="h8" sx={{ fontStyle: "bold" }}>
                      {`${broiler?.farmer_name} ${broiler?.farm_name}`.toUpperCase()}
                    </Typography>

                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ p: 2, border: '1px dashed blue', borderRadius: '5px', marginBottom: 2, boxShadow: 5 }}>
                    <Grid container spacing={2} justifyContent="flex" >
                      <Grid item xs={12} sm={6} md={6} lg={6}>

                        <Typography variant="subtitle1" align="left" gutterBottom>
                          {`${broiler?.breed}, ${broiler?.hatch_date}`}
                        </Typography>
                        <Typography variant="subtitle1" align="left" gutterBottom>
                          {`Email: ${broiler?.email}`}
                        </Typography>
                        <Typography variant="subtitle1" align="left" gutterBottom>
                          {`Phone_number: ${broiler?.Phone_Number}`}
                        </Typography>
                        <Typography variant="subtitle1" align="left" gutterBottom>
                          {`Flock ID: ${broiler?.Flock_ID}`}
                        </Typography>
                      </Grid><Grid item xs={12} sm={6} md={6} lg={6}>

                        <Typography variant="subtitle1" align="left" gutterBottom>
                          {`Region: ${broiler?.region}`}
                        </Typography>
                        <Typography variant="subtitle1" align="left" gutterBottom>
                          {`Zone: ${broiler?.zone}`}
                        </Typography>
                        <Typography variant="subtitle1" align="left" gutterBottom>
                          {`Kebele: ${broiler?.kebele}`}
                        </Typography>
                        <Typography variant="subtitle1" align="left" gutterBottom>
                          {`Registered Date: ${broiler?.record_date}`}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
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

