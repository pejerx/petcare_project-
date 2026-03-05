import axiosInstance from './axiosInstance';

const BASE = '/api/pets';

// CREATE: Add a new pet
export const createPet = (pet) => {
  return axiosInstance.post(BASE, pet);
};

// READ: Get all pets
export const getPets = () => {
  return axiosInstance.get(BASE);
};

// READ: Get one pet by ID
export const getPetById = (id) => {
  return axiosInstance.get(`${BASE}/${id}`);
};

// UPDATE: Update an existing pet by ID
export const updatePet = (id, updatedPet) => {
  return axiosInstance.put(`${BASE}/${id}`, updatedPet);
};

// DELETE: Remove a pet by ID
export const deletePet = (id) => {
  return axiosInstance.delete(`${BASE}/${id}`);
};
