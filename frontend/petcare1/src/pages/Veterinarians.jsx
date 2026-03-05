import React, { useEffect, useState } from 'react';
import './Veterinarians.css';
import Header from '../components/Header';
import axiosInstance from '../api/axiosInstance';

const Veterinarian = () => {
  const [vets, setVets] = useState([]);

  useEffect(() => {
    axiosInstance.get('/api/veterinarians')
      .then((res) => {
        setVets(res.data);
      })
      .catch((err) => {
        console.error('Error fetching veterinarians:', err);
      });
  }, []);

  return (
    <>
      <Header />
      <div className="vet-page">
        <h1>Our Trusted Veterinarians</h1>
        <div className="vet-cards">
          {vets.map((vet, index) => (
            <div className="vet-card" key={index}>
              <img src={vet.image} alt={vet.name} className="vet-img" />
              <h3>{vet.firstname}</h3>
              <h3>{vet.lastname}</h3>
              <p className="specialty">{vet.specialization}</p>
              <div className="tags">
                <span className="tag blue">{vet.experience}</span>
                <span className="tag yellow">{vet.animals}</span>
              </div>
              <p className="clinic">{vet.clinic}</p>
              <p className="location">{vet.location}</p>
              <p className="consult">➕ Face-to-face consultation</p>

            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Veterinarian;
