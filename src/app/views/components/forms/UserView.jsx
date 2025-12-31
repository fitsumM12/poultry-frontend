import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  Avatar,
  Paper
} from '@mui/material';
import { getUser } from 'app/apis/users_api';

export default function UserView({ userId, onClose }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser(userId);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [userId]);

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">User Details</Typography>
        <Button onClick={onClose}>Close</Button>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar
            src={user.image}
            sx={{ width: 150, height: 150 }}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Username:</Typography>
              <Typography variant="body1">{user.username}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Email:</Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Role:</Typography>
              <Typography variant="body1">{user.role}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Status:</Typography>
              <Typography variant="body1">{user.status}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Breed:</Typography>
              <Typography variant="body1">{user.breed}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Birthday:</Typography>
              <Typography variant="body1">
                {user.birthday ? new Date(user.birthday).toLocaleDateString() : 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Phone_Number:</Typography>
              <Typography variant="body1">{user.Phone_Number || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Region:</Typography>
              <Typography variant="body1">{user.region || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Zone:</Typography>
              <Typography variant="body1">{user.zone || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Kebele:</Typography>
              <Typography variant="body1">{user.kebele || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Health Institution:</Typography>
              <Typography variant="body1">{user.hospital || 'N/A'}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}