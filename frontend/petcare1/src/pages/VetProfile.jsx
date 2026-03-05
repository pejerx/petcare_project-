import React, { useState, useEffect } from 'react';
import './Profile.css';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

import axiosInstance from '../api/axiosInstance';

const VetProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [vetId, setVetId] = useState(null);
  const [profile, setProfile] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    specialization: '',
    clinic: '',
    location: '',
    animals: '',
  });

  useEffect(() => {
    const storedVet = JSON.parse(localStorage.getItem('veterinarian'));
    const email = storedVet?.email;

    if (!email) {
      alert('You must be logged in to view this page.');
      navigate('/vet-dashboard');
      return;
    }

    axiosInstance.get(`/api/veterinarians/email/${email}`)
      .then((res) => {
        const data = res.data;
        setVetId(data.id);
        setProfile({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          phoneNumber: data.phoneNumber,
          specialization: data.specialization || '',
          clinic: data.clinic || '',
          location: data.location || '',
          animals: data.animals || '',
        });
      })
      .catch(() => {
        alert('Veterinarian not found!');
      });
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axiosInstance.put(`/api/veterinarians/${vetId}`, profile)
      .then(() => {
        alert('Profile updated!');
        setIsEditing(false);
        // Optional: update localStorage with new profile data
        localStorage.setItem('veterinarian', JSON.stringify({ ...profile, id: vetId }));
      })
      .catch(() => alert('Failed to update profile'));
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
            <TextField
              fullWidth
              label="Clinic"
              name="clinic"
              value={profile.clinic}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
          </div>

          <div className="right-fields">
            <TextField
              fullWidth
              label="Specialization"
              name="specialization"
              value={profile.specialization}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Animals"
              name="animals"
              value={profile.animals}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={profile.location}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default VetProfile;
