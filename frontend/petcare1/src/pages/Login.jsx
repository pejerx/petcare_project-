import React, { useState } from 'react';
import './Login.css';
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

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('petowner'); // 'petowner' or 'veterinarian'

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleLogin = async () => {
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      const endpoint =
        role === 'petowner'
          ? '/api/petowners/login'
          : '/api/veterinarians/login';

      const res = await axiosInstance.post(endpoint, {
        email: form.email,
        password: form.password,
      });

      // Store user info in localStorage
      const userKey = role === 'petowner' ? 'petOwner' : 'veterinarian';
      localStorage.setItem(userKey, JSON.stringify(res.data));

      localStorage.setItem('user', JSON.stringify({ email: form.email, role }));
      window.dispatchEvent(new Event('storageChange'));

      navigate(role === 'petowner' ? '/profile' : '/vet-dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="login-left">
          <img src={logo} width={150} height={40} alt="Logo" />

          <h1>Login</h1>

          <Tabs value={role} textColor="secondary" indicatorColor="secondary" onChange={(e, newVal) => setRole(newVal)} sx={{ mb: 2 }}>
            <Tab label="Pet Owner" value="petowner" />
            <Tab label="Veterinarian" value="veterinarian" />
          </Tabs>

          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />

          <div className="forgot-password">Forgot Password?</div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <CustomButton
            fullWidth
            variant="contained"
            color="primary"
            className="login-button"
            onClick={handleLogin}
          >
            Sign in
          </CustomButton>

          <div className="or">Or Continue With</div>
          <div className="social-buttons">
            <CustomButton variant="outlined">G</CustomButton>
            <CustomButton variant="outlined">F</CustomButton>
            <CustomButton variant="outlined">Y</CustomButton>
          </div>

          <p className="bottom-text">
            Don't have an account yet?{' '}
            <span className="link" onClick={() => navigate('/signup')}>
              Register for free
            </span>
          </p>
        </div>

        <div className="login-right">
          <img src="/Pictures/1.png" alt="Dogs" />
        </div>
      </div>
    </>
  );
};

export default Login;
