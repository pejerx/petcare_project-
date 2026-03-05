import axiosInstance from './axiosInstance';

const BASE = '/api/appointments';

// CREATE: Add a new appointment
export const createAppointment = (appointment) => {
  return axiosInstance.post(BASE, appointment);
};

// READ: Get all appointments
export const getAppointments = () => {
  return axiosInstance.get(BASE);
};

// READ: Get one appointment by ID
export const getAppointmentById = (id) => {
  return axiosInstance.get(`${BASE}/${id}`);
};

// READ: Get appointments by owner ID
export const getAppointmentsByOwnerId = (ownerId) => {
  return axiosInstance.get(`${BASE}/owner/${ownerId}`);
};

// DELETE: Remove an appointment by ID
export const deleteAppointment = (id) => {
  return axiosInstance.delete(`${BASE}/${id}`);
};

export const updateAppointment = async (id, data) => {
  const res = await axiosInstance.put(`${BASE}/${id}`, data);
  return res.data;
};

// PATCH: Update status of an appointment
export const updateAppointmentStatus = async (id, status) => {
  const res = await axiosInstance.patch(`${BASE}/${id}/status`, { status });
  return res.data;
};
