import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/api/appointments')
      .then(response => {
        setAppointments(response.data);
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
      });
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Appointment Records
        </Typography>

        {appointments.length === 0 ? (
          <Typography>No appointments found.</Typography>
        ) : (
          <List>
            {appointments.map((appt, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`${appt.fullName} | ${appt.petType} | ${appt.date} ${appt.time}`}
                    secondary={`Service: ${appt.serviceType} | Location: ${appt.location} | Status: ${appt.status}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}

        <Box mt={2}>
          <Button variant="contained" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AppointmentsList;
