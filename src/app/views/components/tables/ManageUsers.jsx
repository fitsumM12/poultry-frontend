import React, { useState, useEffect } from "react";
import { 
  Box, Table, TableRow, TableBody, TableCell, 
  TableHead, IconButton, TablePagination, 
  Snackbar, Alert, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions, 
  Button, styled 
} from "@mui/material";
import { 
  Block as BlockIcon, 
  Delete as DeleteIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon
} from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import UserManageCard from 'app/views/components/UserManageCard';
import { 
  getUsers, blockUser, approveUser, 
  deleteUser, addUser, getUser 
} from 'app/apis/users_api';
import useAppContext from "app/hooks/useAppContext";
import UserForm from '../forms/UserForm';

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
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } }
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } }
  }
}));

export default function ManageUser() {
  const [page, setPage] = useState(0);
  const { state, dispatch } = useAppContext();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [change, setChange] = useState(false);
  const [userId, setUserId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    content: '',
    action: null
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        showSnackbar('Error fetching users', 'error');
      }
    };
    fetchUsers();
  }, [change, state?.add_new_user, state?.view_user]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleConfirmAction = (title, content, action) => {
    setConfirmDialog({
      open: true,
      title,
      content,
      action: async () => {
        try {
          await action();
          setChange(prev => !prev);
          showSnackbar(`${title} successful`);
        } catch (error) {
          showSnackbar(`Error during ${title.toLowerCase()}`, 'error');
        }
      }
    });
  };

  const handleBlock = (userId) => {
    handleConfirmAction(
      'Block User',
      'Are you sure you want to block this user?',
      () => blockUser(userId)
    );
  };

  const handleApprove = (userId) => {
    handleConfirmAction(
      'Approve User',
      'Are you sure you want to approve this user?',
      () => approveUser(userId)
    );
  };

  const handleDelete = (userId) => {
    handleConfirmAction(
      'Delete User',
      'This action cannot be undone. Are you sure?',
      () => deleteUser(userId)
    );
  };

  const handleUserView = (userId) => {
    setUserId(userId);
    dispatch({ type: 'TOGGLE_VIEW_USER', payload: userId });
  };

  const handleEditUser = (userId) => {
    setUserId(userId);
    dispatch({ type: 'TOGGLE_ADD_NEW_USER', payload: userId });
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (userId) {
        // Implement update logic here
        showSnackbar('Update functionality to be implemented', 'info');
      } else {
        await addUser(values);
        showSnackbar('User created successfully');
      }
      setSubmitting(false);
      setChange(prev => !prev);
      dispatch({ type: 'TOGGLE_ADD_NEW_USER', payload: null });
    } catch (error) {
      setSubmitting(false);
      showSnackbar(error.message || 'Error processing request', 'error');
    }
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  return (
    <Container>
      <UserManageCard title="Manage User">
        {!state?.add_new_user && !state?.view_user ? (
          <Box width="100%" overflow="auto">
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Username</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Role</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell align="center">{user.username}</TableCell>
                      <TableCell align="center">{user.email?.toLowerCase()}</TableCell>
                      <TableCell align="center">{user.role}</TableCell>
                      <TableCell align="center">{user.status}</TableCell>
                      <TableCell align="right">
                        {user.status !== 'BLOCKED' && (
                          <Tooltip title="Block">
                            <IconButton onClick={() => handleBlock(user.id)}>
                              <BlockIcon color="error" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {user.status === 'PENDING' && (
                          <Tooltip title="Approve">
                            <IconButton onClick={() => handleApprove(user.id)}>
                              <CheckCircleOutlineIcon color="success" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="View">
                          <IconButton onClick={() => handleUserView(user.id)}>
                            <VisibilityIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEditUser(user.id)}>
                            <EditIcon color="warning" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDelete(user.id)}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </StyledTable>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </Box>
        ) : (
          <UserForm
            userId={userId}
            onSubmit={handleSubmit}
            onCancel={() => {
              dispatch({ type: 'TOGGLE_ADD_NEW_USER', payload: null });
              dispatch({ type: 'TOGGLE_VIEW_USER', payload: null });
            }}
          />
        )}
      </UserManageCard>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseConfirmDialog}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button
            onClick={() => {
              confirmDialog.action();
              handleCloseConfirmDialog();
            }}
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}