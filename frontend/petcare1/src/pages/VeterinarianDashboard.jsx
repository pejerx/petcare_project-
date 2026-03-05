import React, { useEffect, useState } from 'react';
import './VeterinarianDashboard.css';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  Paper,
  Box,
  Modal
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axiosInstance from '../api/axiosInstance';
import logo from '/src/assets/fetch_and_fur_logo1.png';
import EditAppointmentForm from '../components/EditAppointmentForm';

const VeterinarianDashboard = () => {
  const navigate = useNavigate();
  const [vetData, setVetData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);

  useEffect(() => {
    const storedVet = localStorage.getItem('veterinarian');
    if (storedVet) {
      const parsedVet = JSON.parse(storedVet);
      setVetData(parsedVet);
      fetchAppointments(parsedVet.id);
    } else {
      navigate('/login');
    }
  }, []);

  const fetchAppointments = (vetId) => {
    axiosInstance
      .get(`/api/appointments/veterinarian/${vetId}`)
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error('Failed to fetch vet appointments:', err));
  };

  const handleDeleteAppointment = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await axiosInstance.delete(`/api/appointments/${id}`);
        setAppointments(prev => prev.filter(appt => appt.id !== id));
      } catch (err) {
        console.error(err);
        alert('Failed to delete appointment.');
      }
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/api/appointments/${id}/status`, { status: newStatus });
      fetchAppointments(vetData.id);
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  const timeSlots = [
    '10:00', '12:00', '13:00', '15:00', '16:00', '17:00', '19:00'
  ];

  const formatTimeLabel = (time) => {
    const [hour, minute] = time.split(':');
    const date = new Date();
    date.setHours(+hour, +minute);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="vet-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} width={230} height={65} alt="Fetch and Fur Logo" className="dashboard-logo" />
        </div>

        <div
          className="profile-section"
          onClick={() => navigate('/vet-profile')}
        >
          <AccountCircleIcon style={{ fontSize: 48 }} />
          <div className="vet-name">{vetData?.lastname || ''}</div>
        </div>

        <nav>
          <ul>
            <li className="active">Manage Schedule</li>
            <li>Appointments</li>
          </ul>
        </nav>

        <div className="logout">
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              localStorage.removeItem('veterinarian');
              localStorage.removeItem('user');
              window.dispatchEvent(new Event('storageChange'));
              navigate('/login');
            }}
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>Welcome, Dr. {vetData?.lastname || ''}</h1>
          <p>This is your dashboard. View and manage your appointments below.</p>
        </div>

        {/* Calendar */}
        <div className="calendar-section">
          <Typography variant="h6" className="calendar-title">
            Today, {new Date().toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long' })}
          </Typography>

          <div className="calendar-scroll">
            {timeSlots.map((slot, i) => {
              const slotAppointments = appointments.filter(appt =>
                appt.time?.startsWith(slot)
              );

              return (
                <Box key={i} className="calendar-slot">
                  <Typography className="slot-time">
                    {formatTimeLabel(slot)}
                  </Typography>

                  {slotAppointments.length === 0 ? (
                    <Paper className="no-appointments" elevation={0}>
                      No appointments
                    </Paper>
                  ) : (
                    slotAppointments.map(appt => (
                      <Paper key={appt.id} className="appointment-card" elevation={2}>
                        <Typography className="appointment-title">
                          {appt.pet?.petname} - {appt.serviceType}
                        </Typography>
                        <Typography variant="body2">
                          Owner: {appt.owner?.firstname} {appt.owner?.lastname}
                        </Typography>
                        {appt.notes && (
                          <Typography variant="body2">
                            Notes: {appt.notes}
                          </Typography>
                        )}
                        <Typography variant="caption" className="appointment-status">
                          Status: {appt.status}
                        </Typography>

                        <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setEditingAppointment(appt)}
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteAppointment(appt.id)}
                          >
                            🗑️ Delete
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() => updateStatus(appt.id, 'Confirmed')}
                          >
                            ✅ Confirm
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => updateStatus(appt.id, 'Finished')}
                          >
                            ✔️ Finished
                          </Button>
                        </Box>
                      </Paper>
                    ))
                  )}
                </Box>
              );
            })}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <Modal open={!!editingAppointment} onClose={() => setEditingAppointment(null)}>
        <Box className="appointment-wrapper">
          <EditAppointmentForm
            appointment={editingAppointment}
            onClose={() => setEditingAppointment(null)}
            onSuccess={() => {
              fetchAppointments(vetData.id);
              setEditingAppointment(null);
            }}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default VeterinarianDashboard;
