import React, { useState } from 'react';
import './SignUp.css';
import { TextField, Button, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import axiosInstance from '../api/axiosInstance';
import logo from '/src/assets/fetch_and_fur_logo1.png';
import { styled } from '@mui/material/styles';

const CustomButton = styled(Button)(({ variant }) => ({
  padding: '0.75rem 2rem',
  fontSize: '1rem',
  fontWeight: 'bold',
  ...(variant === 'contained' && {
    backgroundColor: '#FF6F00',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#e65c00',
    },
  }),
  ...(variant === 'outlined' && {
    backgroundColor: 'transparent',
    border: '2px solid #FF6F00',
    color: '#FF6F00',
    '&:hover': {
      backgroundColor: '#fff3e0',
      borderColor: '#e65c00',
      color: '#e65c00',
    },
  }),
}));
const SignUp = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState('petowner'); // 'petowner' or 'veterinarian'

  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    experience: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    const {
      firstname, lastname, email, phoneNumber,
      address, password, confirmPassword,
      specialization, experience
    } = form;

    // Common validations
    if (!firstname || !lastname || !email || !phoneNumber || !password || !confirmPassword) {
      setError('Please fill out all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      if (role === 'petowner') {
        await axiosInstance.post('/api/petowners', {
          firstname, lastname, email, phoneNumber, address, password
        });
        alert('Pet Owner account created!');
      } else {
        if (!specialization || !experience) {
          setError('Please fill out specialization and experience.');
          return;
        }
        await axiosInstance.post('/api/veterinarians', {
          firstname, lastname, email, phoneNumber, specialization, experience, password
        });
        alert('Veterinarian account created!');
      }

      navigate('/login');
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data || 'Registration failed.');
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <form className="login-left">
          <img src={logo} width={150} height={40} alt="Logo" />
          <h1>Sign Up</h1>
          <Tabs textColor="secondary" indicatorColor="secondary" value={role} onChange={(e, newVal) => setRole(newVal)} sx={{ mb: 2 }}>
            <Tab label="Pet Owner" value="petowner" />
            <Tab label="Veterinarian" value="veterinarian" />
          </Tabs>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(() => {
              const fields = [
                { label: 'First Name', name: 'firstname' },
                { label: 'Last Name', name: 'lastname' },
                { label: 'Email', name: 'email' },
                { label: 'Phone Number', name: 'phoneNumber' },
                ...(role === 'petowner' ? [{ label: 'Address', name: 'address' }] : []),
                ...(role === 'veterinarian'
                  ? [
                    { label: 'Specialization', name: 'specialization' },
                    { label: 'Experience (years)', name: 'experience', type: 'number' },
                  ]
                  : []),
                { label: 'Password', name: 'password', type: 'password' },
                { label: 'Confirm Password', name: 'confirmPassword', type: 'password' },
              ];

              // Group into pairs (2 per row)
              const rows = [];
              for (let i = 0; i < fields.length; i += 2) {
                rows.push(fields.slice(i, i + 2));
              }

              return rows.map((row, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                  {row.map((field) => (
                    <TextField
                      key={field.name}
                      label={field.label}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                      type={field.type || 'text'}
                    />
                  ))}
                  {row.length === 1 && <div style={{ flex: 1 }} />} {/* Empty space filler if odd number */}
                </div>
              ));
            })()}
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}

          <CustomButton fullWidth variant="contained" onClick={handleSubmit}>
            Create Account
          </CustomButton>
          <div className="or">Or Continue With</div>
          <div className="social-buttons">
            <CustomButton variant="outlined">G</CustomButton>
            <CustomButton variant="outlined">f</CustomButton>
            <CustomButton variant="outlined">🔵</CustomButton>
          </div>

          <p className="bottom-text">
            Already have an account?{' '}
            <span className="link" onClick={() => navigate('/login')}>Login here</span>
          </p>
        </form>





        {/* <div className="login-left">
          

          <Tabs value={role} onChange={(e, newVal) => setRole(newVal)} sx={{ mb: 2 }}>
            <Tab label="Pet Owner" value="petowner" />
            <Tab label="Veterinarian" value="veterinarian" />
          </Tabs>
          
          <TextField label="First Name" name="firstname" value={form.firstname} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Last Name" name="lastname" value={form.lastname} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Phone Number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} fullWidth margin="normal" />

          {role === 'petowner' && (
            <TextField label="Address" name="address" value={form.address} onChange={handleChange} fullWidth margin="normal" />
          )}

          {role === 'veterinarian' && (
            <>
              <TextField label="Specialization" name="specialization" value={form.specialization} onChange={handleChange} fullWidth margin="normal" />
              <TextField label="Experience (years)" name="experience" type="number" value={form.experience} onChange={handleChange} fullWidth margin="normal" />
            </>
          )}

          <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} fullWidth margin="normal" />

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}

          <Button fullWidth variant="contained" onClick={handleSubmit}>
            Create Account
          </Button>

          <div className="or">Or Continue With</div>
          <div className="social-buttons">
            <Button variant="outlined">G</Button>
            <Button variant="outlined">f</Button>
            <Button variant="outlined">🔵</Button>
          </div>

          <p className="bottom-text">
            Already have an account?{' '}
            <span className="link" onClick={() => navigate('/login')}>Login here</span>
          </p>
        </div> */}

        <div className="login-right">
          <img src="/Pictures/1.png" alt="Dogs" />
        </div>
      </div>
    </>
  );
};

export default SignUp;
