import React, { useEffect, useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  Button
} from '@mui/material';
import axiosInstance from './axiosInstance';

const VetAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const vet = JSON.parse(localStorage.getItem('veterinarian'));

  useEffect(() => {
    if (vet?.id) {
      axiosInstance.get(`/api/appointments/veterinarian/${vet.id}`)
        .then(res => setAppointments(res.data))
        .catch(err => console.error('Failed to fetch appointments', err));
    }
  }, [vet]);

  const handleChange = (id, field, value) => {
    setAppointments(prev =>
      prev.map(app => (app.id === id ? { ...app, [field]: value } : app))
    );
  };

  const handleSave = async (id) => {
    const updated = appointments.find(a => a.id === id);
    try {
      await axiosInstance.put(`/api/appointments/${id}`, updated);
      alert('Appointment updated');
      setEditingId(null);
    } catch (err) {
      alert('Failed to update appointment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await axiosInstance.delete(`/api/appointments/${id}`);;
      setAppointments(appointments.filter(a => a.id !== id));
      alert('Appointment canceled');
    } catch (err) {
      alert('Failed to cancel appointment');
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: '2rem', marginTop: '2rem' }}>
      <Typography variant="h6" gutterBottom>
        Your Appointments
      </Typography>

      {appointments.length === 0 ? (
        <Typography>No appointments yet.</Typography>
      ) : (
        appointments.map((appt) => (
          <Box
            key={appt.id}
            sx={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem'
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputLabel>Pet Name</InputLabel>
                <TextField
                  fullWidth
                  value={appt.pet?.petname || appt.petName || ''}
                  disabled
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <InputLabel>Date</InputLabel>
                <TextField
                  type="date"
                  fullWidth
                  value={appt.date}
                  disabled={editingId !== appt.id}
                  onChange={(e) => handleChange(appt.id, 'date', e.target.value)}
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <InputLabel>Time</InputLabel>
                <Select
                  fullWidth
                  value={appt.time}
                  disabled={editingId !== appt.id}
                  onChange={(e) => handleChange(appt.id, 'time', e.target.value)}
                >
                  <MenuItem value="10:00">10AM - 12PM</MenuItem>
                  <MenuItem value="13:00">1PM - 2PM</MenuItem>
                  <MenuItem value="14:00">2PM - 4PM</MenuItem>
                  <MenuItem value="16:00">4PM - 6PM</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sm={4}>
                <InputLabel>Service Type</InputLabel>
                <Select
                  fullWidth
                  value={appt.serviceType}
                  disabled={editingId !== appt.id}
                  onChange={(e) => handleChange(appt.id, 'serviceType', e.target.value)}
                >
                  <MenuItem value="Grooming">Grooming</MenuItem>
                  <MenuItem value="Vaccination">Vaccination</MenuItem>
                  <MenuItem value="Check-up">Check-up</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12} sm={8}>
                <InputLabel>Notes</InputLabel>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={appt.notes || ''}
                  disabled={editingId !== appt.id}
                  onChange={(e) => handleChange(appt.id, 'notes', e.target.value)}
                />
              </Grid>
            </Grid>

            <Box sx={{ textAlign: 'right', mt: 2 }}>
              {editingId === appt.id ? (
                <>
                  <Button onClick={() => setEditingId(null)} sx={{ mr: 1 }}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="success" onClick={() => handleSave(appt.id)}>
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => handleDelete(appt.id)} color="error" sx={{ mr: 1 }}>
                    Cancel
                  </Button>
                  <Button variant="outlined" onClick={() => setEditingId(appt.id)}>
                    Edit
                  </Button>
                </>
              )}
            </Box>
          </Box>
        ))
      )}
    </Paper>
  );
};

export default VetAppointmentList;
