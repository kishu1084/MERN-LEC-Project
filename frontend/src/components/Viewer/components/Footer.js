import React, { useState } from "react";
import { FaLinkedinIn} from "react-icons/fa6";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';
import { FaComment,FaHeart, FaEnvelope, FaInstagram, FaPhone } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import CounselingForm from "./CounselingForm";
import AuthModal from "../../pages/AuthModal";

const Footer = () => {
    const [showForm, setShowForm] = useState(false);
    const [userData, setUserData] = useState([]);
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const handleCounselingClick = () => {
        if (!user) {
          setIsOpen(true);
          return;
        }
        setUserData([{ name: user.name, email: user.email, phone: user.phone }]);
        setShowForm(true);
      };
  return (
    <footer className="bg-black text-white py-5 w-100">
        {isOpen && <AuthModal isOpen={isOpen} setIsOpen={setIsOpen} />}
        
        <div className="container-fluid bg-black px-5">
            <div className="row align-items-center justify-content-between">
            {/* Left Section */}
            <div className="col-md-6 text-start mb-4 mb-md-0">
                <h2 className="text-danger fw-bold"><strong>SSM LEC</strong></h2>
                <p className="mb-3">Transforming Passion into Profession</p>
                <div className="d-flex gap-3">
                <a href="https://instagram.com" className="social-icon text-white">
                    <FaEnvelope />
                </a>
                
                <a href="https://instagram.com" className="social-icon text-white">
                    <FaLinkedinIn />
                </a>
                <a href="https://instagram.com" className="social-icon text-white">
                    <FaInstagram />
                </a>
                </div>
                {/* // DO NOT MODIFY THIS SECTION. It is a critical part of the website.
                // Any changes to this text must be approved. */}
                <p className="text-start mt-2 text-secondary small">
                    © 2025 | Developed with{" "}
                    <FaHeart className="text-white mx-1 heart-glow" /> by{" "}
                    <span className="fw-semibold">Krishna</span>
                </p>
            </div>

            {/* Right Section */}
            <div className="col-md-6 text-md-end text-start d-flex flex-column align-items-md-end align-items-start gap-3">
                <button className="btn btn-outline-light rounded-pill d-flex align-items-center px-4 py-2">
                <FaPhone className="me-2" /> 1800 210 2020
                </button>
                <button className="btn btn-outline-light rounded-pill d-flex align-items-center px-4 py-2" onClick={handleCounselingClick}>
                <FaComment className="me-2" /> Get Free Career Counselling
                </button>
                {showForm && <CounselingForm userData={userData} onClose={() => setShowForm(false)} />}
            </div>
            </div>
        </div>
    </footer>

  );
};

export default Footer;
