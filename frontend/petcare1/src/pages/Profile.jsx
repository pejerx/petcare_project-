import React, { useState, useEffect } from 'react';
import './Profile.css';
import { TextField, Button, Modal, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import axiosInstance from '../api/axiosInstance';
import PetRegisterForm from '../components/PetRegisterForm';
import EditAppointmentForm from '../components/EditAppointmentForm';
import EditPet from '../components/EditPet';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [petOwnerId, setPetOwnerId] = useState(null);
  const [registerOpen, setPetRegisterOpen] = useState(false);
  const [profile, setProfile] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

  const [pets, setPets] = useState([]);
  const [history, setHistory] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editingPet, setEditingPet] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem('petOwner'));
  const email = storedUser?.email;

  useEffect(() => {
    if (!email) {
      alert('You must be logged in to view this page.');
      navigate('/login');
      return;
    }

    axiosInstance.get(`/api/petowners/email/${email}`)
      .then((res) => {
        const data = res.data;
        setProfile({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
        });
        setPetOwnerId(data.id);

        // Fetch appointments
        axiosInstance.get(`/api/appointments/owner/${data.id}`)
          .then((res) => setHistory(res.data))
          .catch(() => console.error('Could not load appointments.'));

        // Fetch pets
        axiosInstance.get(`/api/pets/owner/${data.id}`)
          .then((res) => setPets(res.data))
          .catch(() => console.error('Could not load pets.'));
      })
      .catch(() => {
        alert('PetOwner not found!');
      });
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axiosInstance.put(`/api/petowners/${petOwnerId}`, profile)
      .then(() => {
        alert('Profile updated!');
        setIsEditing(false);
      })
      .catch(() => alert('Failed to update profile'));
  };

  const handleUpdate = (id, data) => {
    setEditingAppointment(data);
  };

  const handleEditSuccess = () => {
    axiosInstance.get(`/api/appointments/owner/${petOwnerId}`)
      .then((res) => setHistory(res.data));
    setEditingAppointment(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      axiosInstance.delete(`/api/appointments/${id}`)
        .then(() => {
          alert('Appointment cancelled');
          setHistory((prev) => prev.filter((item) => item.id !== id));
        });
    }
  };

  const handleDeletePet = (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      axiosInstance.delete(`/api/pets/${petId}`)
        .then(() => {
          alert('Pet deleted!');
          setPets(prev => prev.filter(p => p.petId !== petId));
        })
        .catch(() => alert('Failed to delete pet.'));
    }
  };

  return (
    <>
      <Header />

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img src="/Pictures/1.png" alt="avatar" />
          </div>
          <div>
            <h3>{profile.firstname} {profile.lastname}</h3>
            <p>{profile.email}</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Button variant="contained" onClick={() => {
              if (isEditing) handleSave();
              else setIsEditing(true);
            }}>
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </div>
        </div>

        <div className="profile-details">
          <div className="left-fields">
            <TextField
              fullWidth
              label="First Name"
              name="firstname"
              value={profile.firstname}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastname"
              value={profile.lastname}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />

            <div className="pets-box">
              <h4>My Pets</h4>
              {pets.length === 0 ? (
                <p>No pets registered.</p>
              ) : (
                pets.map((pet) => (
                  <div key={pet.petId} className="history-entry">
                    <div><strong>{pet.petname}</strong></div>
                    <div>Breed: {pet.breed}</div>
                    <div>Weight: {pet.weight}</div>
                    <div className="pet-buttons">
                      <Button size="small" onClick={() => setEditingPet(pet)}>📝</Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeletePet(pet.petId)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                ))
              )}

              <Button onClick={() => setPetRegisterOpen(true)} className="add-pet-btn" variant="outlined">
                + Add/Register Your Pet
              </Button>
            </div>
          </div>

          <div className="right-fields">
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={profile.address}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={profile.email}
              disabled
              margin="normal"
            />
            <div className="container">
            </div>

            <div className="history-box">
              <h4>Appointment History</h4>
              {history.length === 0 ? (
                <p>No appointments found.</p>
              ) : (
                <>
                  {history.slice(0, 3).map((log, i) => (
                    <div key={i} className="history-entry">
                      <div><strong>{log.pet?.petname}</strong> - {log.serviceType}</div>
                      <div>Vet: Dr. {log.veterinarian?.firstname} {log.veterinarian?.lastname}</div>
                      <div>{log.date} at {log.time}</div>
                      <div>Status: {log.status}</div>
                      <Button size="small" onClick={() => handleUpdate(log.id, log)}>📝</Button>
                      <Button size="small" color="error" onClick={() => handleDelete(log.id)}>🗑️</Button>
                    </div>
                  ))}
                  {history.length >= 3 && (
                    <div className="see-more-wrapper">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        className="see-more-btn"
                        onClick={() => window.location.href = '/appointments-list'}
                      >
                        See More →
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Register Pet Modal */}
      <Modal open={registerOpen} onClose={() => setPetRegisterOpen(false)}>
        <Box className="appointment-wrapper">
          <PetRegisterForm
            petOwnerId={petOwnerId}
            onClose={() => setPetRegisterOpen(false)}
            onSuccess={() => {
              setPetRegisterOpen(false);
              axiosInstance.get(`/api/pets/owner/${petOwnerId}`)
                .then((res) => setPets(res.data))
                .catch(() => console.error('Could not refresh pets list.'));
            }}
          />
        </Box>
      </Modal>

      {/* Edit Pet Modal */}
      <Modal open={!!editingPet} onClose={() => setEditingPet(null)}>
        <Box className="appointment-wrapper">
          <EditPet
            pet={editingPet}
            onClose={() => setEditingPet(null)}
            onSuccess={() => {
              setEditingPet(null);
              axiosInstance.get(`/api/pets/owner/${petOwnerId}`)
                .then((res) => setPets(res.data));
            }}
          />
        </Box>
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal open={!!editingAppointment} onClose={() => setEditingAppointment(null)}>
        <Box className="appointment-wrapper">
          <EditAppointmentForm
            appointment={editingAppointment}
            onClose={() => setEditingAppointment(null)}
            onSuccess={handleEditSuccess}
          />
        </Box>
      </Modal>
    </>
  );
};

export default Profile;
