import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";

import AddCircleIcon from '@mui/icons-material/AddCircle';
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
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import BroilerForm from "../forms/BroilerForm";

import { useNavigate } from 'react-router-dom';
import useAppContext, { AppContext } from "app/hooks/useAppContext";
import { getUser } from "app/apis/users_api";

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
    margin: "auto",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  image: {
    width: "100%",
    height: "auto",
    maxHeight: "200px",
  },
}));

const ZoomImage = ({ imageUrl, onClose }) => {
  // console.log("Image Url:", imageUrl)
  return (
    <Dialog open={Boolean(imageUrl)} onClose={onClose} maxWidth="lg">
      <DialogContent>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          style={{ position: "absolute", right: 16, top: 16 }}
        >
          <CloseIcon />
        </IconButton>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Enlarged"
            style={{ width: "100%", height: "auto" }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

// MAIN COMPONENT
const BroilerProfile = ({ data }) => {
  const { state, dispatch } = useAppContext()
  const navigate = useNavigate();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [broilers, setBroilers] = useState([]);
  const [zoomedImageUrl, setZoomedImageUrl] = useState(null);
  const [supervisorDetails, setsupervisorDetails] = useState({});

  useEffect(() => {
    const fetchBroilers = async () => {
      try {
        const broilerData = await fetchBroilerById(data.id);
        setBroilers(broilerData);

        const uniquesupervisorIds = [...new Set(broilerData?.map(broiler => broiler?.supervisor_id))];
        const supervisorPromises = uniquesupervisorIds?.map(supervisorId => getUser(supervisorId));

        const supervisors = await Promise.all(supervisorPromises);
        const supervisorDetailsMap = {};
        uniquesupervisorIds?.forEach((supervisorId, index) => {
          supervisorDetailsMap[supervisorId] = supervisors[index];
        });
        setsupervisorDetails(supervisorDetailsMap);
      } catch (error) {
        console.error("Error fetching broilers:", error);
      }
    };

    fetchBroilers();
  }, [data]);
  useEffect(() => {
    // console.log("Updated supervisor details:", supervisorDetails);
  }, [supervisorDetails]);

  const [searchQuery, setSearchQuery] = useState('');
  const filteredBroiler = broilers?.filter((broiler) =>
    String(broiler?.record_date).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleNewScreening = (id) => {
    dispatch({ type: 'START_NEW_SCREENING', payload: id });
    navigate('/newcase/')
  };
  // MEDIA BASE URL
  const mediaBaseUrl = `${process.env.REACT_APP_SERVER_IP_ADDRESS}/media/raw/`;
  return (
    <>
      <CardContent>
        <Box width="100%" overflow="auto">
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <ValidatorForm>
                    <TextValidator
                      label="Date"
                      onChange={(e) => setSearchQuery(e.target.value)}
                      name="id"
                      value={searchQuery}
                      validators={['required']}
                      errorMessages={['this field is required']}
                    />
                  </ValidatorForm>
                </TableCell>
                <TableCell align="center" colSpan={2}>Image
                  <IconButton
                    onClick={() => handleNewScreening(data.id)}
                    sx={{ align: "right", "&:hover": { bgcolor: "grey.200" } }}
                  >
                    <AddCircleIcon sx={{ color: "#fa931d" }} />
                  </IconButton>
                </TableCell>
                <TableCell align="center" >supervisor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBroiler
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((broiler, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">
                      {broiler?.record_date}
                    </TableCell>
                    <TableCell align="center">{broiler?.image_prediction}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Image">
                        <span
                          style={{ cursor: "pointer", color: broiler?.broiler_image ? "#181b62" : "gray" }}
                          onClick={() => {
                            if (broiler.broiler_image) {
                              const ImageName = broiler?.broiler_image?.split('\\').pop();
                              // console.log(ImageName)
                              setZoomedImageUrl(`${mediaBaseUrl}${ImageName}`);
                            }
                          }}
                        >
                          <VisibilityIcon sx={{ color: broiler?.broiler_image ? "#181b62" : "gray" }} />
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      {supervisorDetails[broiler.supervisor_id] ? (
                        <>
                          {supervisorDetails[broiler?.supervisor_id]?.farmer_name} {supervisorDetails[broiler?.supervisor_id].farm_name}
                        </>
                      ) : (
                        <p>Loading supervisor details...</p>
                      )}
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
      </CardContent>
      <ZoomImage imageUrl={zoomedImageUrl} onClose={() => setZoomedImageUrl(null)} />
    </>
  );
};

export default BroilerProfile;