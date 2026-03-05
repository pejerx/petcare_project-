// src/components/EditPet.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import './AppointmentForm.css'; // Reuse your styles
import axiosInstance from './axiosInstance';

const EditPet = ({ pet, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    id: '',
    petname: '',
    type: '',
    weight: '',
    breed: '',
  });

  useEffect(() => {
    if (pet) {
      setFormData({
        id: pet.id || pet.petId,
        petname: pet.petname || '',
        type: pet.type || '',
        weight: pet.weight || '',
        breed: pet.breed || '',
        petOwnerId: pet.petOwner?.id || pet.petOwnerId || '',
      });
    }
  }, [pet]);

  const handleSubmit = async () => {
    try {
      await axiosInstance.put(`/api/pets/${formData.id}`, formData);
      alert('Pet updated successfully!');
      onSuccess?.(); // Refresh the pet list
    } catch (err) {
      console.error(err);
      alert('Failed to update pet.');
    }
  };

  return (
    <Paper elevation={4} className="appointment-container">
      <Box className="appointment-header">
        <Typography variant="h6">Edit Pet</Typography>
        <Button sx={{ color: 'white' }} onClick={onClose}>
          Close ✕
        </Button>
      </Box>

      <Box className="appointment-body">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <InputLabel className="input-label">Pet Name</InputLabel>
            <TextField
              fullWidth
              value={formData.petname}
              onChange={(e) => setFormData({ ...formData, petname: e.target.value })}
            />

            <Box mt={3}>
              <InputLabel className="input-label">Pet Type</InputLabel>
              <Select
                fullWidth
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="Dog">Dog</MenuItem>
                <MenuItem value="Cat">Cat</MenuItem>
                <MenuItem value="Bird">Bird</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <InputLabel className="input-label">Weight (kg)</InputLabel>
            <TextField
              fullWidth
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />

            <Box mt={3}>
              <InputLabel className="input-label">Breed</InputLabel>
              <TextField
                fullWidth
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              />
            </Box>
          </Grid>
        </Grid>

        <Box className="appointment-footer">
          <Button className="custom-button outlined" onClick={onClose}>Cancel</Button>
          <Button className="custom-button contained" onClick={handleSubmit}>Confirm</Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default EditPet;
