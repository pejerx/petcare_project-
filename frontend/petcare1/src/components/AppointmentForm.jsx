// src/components/AppointmentForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Button, Grid, InputLabel, MenuItem,
  Select, TextField, Typography, Paper
} from '@mui/material';
import axiosInstance from './axiosInstance';
import './AppointmentForm.css';


const AppointmentForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    petId: '',
    veterinarianId: '',
    date: '',
    time: '',
    serviceType: '',
    status: 'Pending',
    notes: '',
    ownerId: null
  });

  const [pets, setPets] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('petOwner');
    if (!user) {
      setIsAuthenticated(false);
      return;
    }

    const parsedUser = JSON.parse(user);
    const ownerId = parsedUser.id;
    setFormData(prev => ({ ...prev, ownerId }));

    axiosInstance.get(`/api/pets/owner/${ownerId}`)
      .then(res => setPets(res.data))
      .catch(() => console.error('Failed to load pets'));

    axiosInstance.get(`/api/veterinarians`)
      .then(res => setVeterinarians(res.data))
      .catch(() => console.error('Failed to load vets'));
  }, []);

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        owner: { id: formData.ownerId },
        pet: { petId: formData.petId },
        veterinarian: { id: formData.veterinarianId }
      };

      await axiosInstance.post('/api/appointments', payload);
      alert('Appointment booked successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert('Failed to book appointment.');
    }
  };

  if (!isAuthenticated) {
    return (
      <Paper elevation={4} className="appointment-container">
        <Box className="appointment-body" sx={{ textAlign: 'center', padding: '2rem' }}>
          <Typography variant="h6">Access Denied</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please log in to book an appointment.
          </Typography>
          <Button variant="contained" onClick={() => {
            onClose();
            window.location.href = '/signup';
          }}>
            Go to Sign Up
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={4} className="appointment-container">
      <Box className="appointment-header">
        <Typography variant="h6">Add Appointment</Typography>
        <Button sx={{ color: 'white' }} onClick={onClose}>Close ✕</Button>
      </Box>

      <Box className="appointment-body">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <InputLabel>Pet</InputLabel>
            <Select
              fullWidth
              value={formData.petId}
              onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
            >
              {pets.length === 0 ? (
                <MenuItem disabled>No pets available</MenuItem>
              ) : pets.map((pet) => (
                <MenuItem key={pet.petId} value={pet.petId}>{pet.petname}</MenuItem>
              ))}
            </Select>

            <Box mt={3}>
              <InputLabel>Veterinarian</InputLabel>
              <Select
                fullWidth
                value={formData.veterinarianId}
                onChange={(e) => setFormData({ ...formData, veterinarianId: e.target.value })}
              >
                {veterinarians.length === 0 ? (
                  <MenuItem disabled>No vets available</MenuItem>
                ) : veterinarians.map((vet) => (
                  <MenuItem key={vet.id} value={vet.id}>Dr. {vet.firstname} {vet.lastname}</MenuItem>
                ))}
              </Select>
            </Box>

            <Box mt={3}>
              <InputLabel>Time</InputLabel>
              <TextField
                type="date"
                fullWidth
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </Box>

            <Box mt={3}>
              <InputLabel>Service</InputLabel>
              <Select
                fullWidth
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              >
                <MenuItem value="Grooming">Grooming</MenuItem>
                <MenuItem value="Vaccination">Vaccination</MenuItem>
                <MenuItem value="Check-up">Check-up</MenuItem>
                <MenuItem value="Check-up">Pet Training</MenuItem>


              </Select>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <InputLabel>Time</InputLabel>
            <Select
              fullWidth
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            >
              <MenuItem value="10:00">10AM - 12PM</MenuItem>
              <MenuItem value="13:00">1PM - 3PM</MenuItem>
              <MenuItem value="14:00">4PM - 6PM</MenuItem>
              <MenuItem value="16:00">6PM - 7PM</MenuItem>
            </Select>

            <Box mt={3}>
              <InputLabel>Notes</InputLabel>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Box>
          </Grid>
        </Grid>

        <Box className="appointment-footer">
          <Button className="custom-button outlined" onClick={onClose}>Cancel</Button>
          <Button className="custom-button contained" onClick={handleSubmit}>Save Changes</Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default AppointmentForm;
