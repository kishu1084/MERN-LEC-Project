import React from 'react';
import { useState, useEffect } from 'react';
import './AutoScrollingLogos.css'; // Import the CSS
import { API_URL } from 'C:/Users/tejal/OneDrive/Desktop/MERN/Project_LEC/frontend/src/utills.js';
import axios from 'axios';
import { toast } from 'react-toastify';

const AutoScrollingLogos = () => {

    const [companies, setCompanies] = useState([]);

    const fetchCompanies = async () => {
        try {
          const res = await axios.get(`${API_URL}/companies/all`);
          setCompanies(res.data.companies);
        } catch (err) {
          toast.error('Error fetching companies');
        }
      };
    
      useEffect(() => {
        fetchCompanies();
      }, []);


    return (
        <div className="logo-slider">
        <div className="logo-track">
            {[...companies, ...companies].map((company, index) => (
            <div className="logo-slide" key={index}>
                <img src={`${API_URL.replace('/api', '')}/uploads/logos/${company.logo}`} alt={company.name} />
            </div>
            ))}
        </div>
        </div>
    );
};

export default AutoScrollingLogos;
