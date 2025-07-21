import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { FaPhoneVolume } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import CounselingForm from './CounselingForm';
import EnrollmentForm from './EnrollmentForm';
import { useAuth } from '../../../context/AuthContext';
import AuthModal from '../../pages/AuthModal';
import  {ToastContainer} from "react-toastify";
import axios from "axios";
import { API_URL } from '../../../utills';
import { RiDoubleQuotesL, RiDoubleQuotesR} from "react-icons/ri";
import bannerImage from 'C:/Users/tejal/OneDrive/Desktop/MERN/Project_LEC/frontend/src/components/pages/logo.png';

const CourseBanner = ({ data, minHeight = "60vh", scrollToRef ,id = 1 }) => {
  const {
    headingLine1,
    headingLine2,
    description,
    phoneText,
    phoneNumber,
    image,
    type,
  } = data;

  const { state } = useLocation();
  const course = state?.course;
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [userData, setUserData] = useState([]);
  const [testimonials, setTestimonial] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTestimonial = testimonials[currentIndex] || {};
  const testimonialImage = currentTestimonial.image;
  const testimonialTitle = currentTestimonial.title;
  

  const fetchTestimonial = async () => {
    try {
      const res = await axios.get(`${API_URL}/testimonial/all`);
      const allTestimonials = res.data;
  
      // Filter only high priority testimonials
      const highPriorityTestimonials = allTestimonials.filter(
        (testimonial) => testimonial.pripority === 'High'
      );
  
      setTestimonial(highPriorityTestimonials);
    } catch (err) {
      console.log('Failed to fetch testimonial', err);
    }
  };
  


  useEffect(() => {
      fetchTestimonial();
    },[])

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 3000);
      return () => clearInterval(interval); // Clean up on unmount
  }, [testimonials.length]);

  
  const handleCounselingClick = () => {
    if (!user) {
      setIsOpen(true);
      return;
    }
    setUserData([{ name: user.name, email: user.email, phone: user.phone }]);
    setShowForm(true);
  };

  const handleEnrollmentClick = () => {
    if (!user) {
      
      setIsOpen(true);
      return;
    }
    setUserData([{ name: user.name, email: user.email, phone: user.phone }]);
    setShowEnrollmentForm(true);
  };


  const getBannerButtonText = (type) => {
    switch (type) {
      case "Free":
        return "Learn For Free";
      case "Premium":
        return "Enroll Now";
      default:
        return "Explore Courses";
    }
  };

  const handleScroll = () => {
    if (scrollToRef?.current) {
      scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  

  return (
    <Card className="w-75 mx-2 mt-5 rounded-5 border-0 d-flex flex-column" style={{ minHeight, overflow: "hidden" }}>
      <ToastContainer
            position='top-right'
            autoClose={3000}
            hideProgressBar={false}
      />
      <Row className="flex-grow-1 g-0 container-fluid">
        {/* Left Column */}
        <Col md={8} className="border-end d-flex flex-column align-items-start justify-content-center p-5 gap-2 border-2 border-danger">
          <Card.Text className="fs-1 fw-bold text-danger mb-0 pb-0">
            <strong>{headingLine1}</strong>
          </Card.Text>
          <Card.Text className="fs-2 fw-bold text-black pt-0 mt-0">
            <strong>{headingLine2}</strong>
          </Card.Text>
          <Card.Text className="text-black text-muted">{description}</Card.Text>
          <Col md={10} className="d-flex align-items-start gap-4">
            <Button className="fw-bold px-5 py-2 fs-5 flex-grow-1 custom-border-button"  onClick={handleCounselingClick}>
              Get Free Career Counselling
            </Button>
            {showForm && <CounselingForm userData={userData} onClose={() => setShowForm(false)} />}
            {showEnrollmentForm && <EnrollmentForm course={course} userData={userData} onClose={() => setShowEnrollmentForm(false)} />}

            {type === "Premium" && (
              <Button className="fw-bold px-5 py-2 fs-5" variant="danger" onClick={handleEnrollmentClick}>
                {getBannerButtonText(type)}
              </Button>)}

            {type !== "Premium" && (
            <Button className="fw-bold px-5 py-2 fs-5" variant="danger" onClick={handleScroll}>
              {getBannerButtonText(type)}
            </Button>)}

            {isOpen && <AuthModal isOpen={isOpen} setIsOpen={setIsOpen} />}

                
          </Col>

          <Card.Text className="mt-2 text-black text-muted">
            <FaPhoneVolume className="me-2" />
            <span>{phoneText} <strong>{phoneNumber}</strong></span>
          </Card.Text>

        </Col>

        {/* Right Column */}
        <Col md={4} className="d-flex align-items-center justify-content-center ">
          {parseInt(id) === 2 ? (
            <div  
              className="p-0 position-relative overflow-hidden h-100 w-100 bannerImg overflow-hidden top-0"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(240, 240, 240, 0.7), rgba(255, 255, 255, 0.7)),url(${bannerImage})`, // your static image
                backgroundSize: '100% 220px', 
                backgroundRepeat: 'no-repeat',
              }}
            >
  
    {/* This will be the person image over the background */}
    <Card.Img
      variant="top"
      src={testimonialImage ? `${API_URL.replace('/api', '')}${testimonialImage}` : image}
      className="w-100 h-100 object-fit-contain position-absolute bottom-0 start-50 translate-middle-x m-0"
      alt="Testimonial Person"
      style={{
        maxHeight: '420px', 
        objectFit: 'contain',
        backgroundImage: `
        linear-gradient(to bottom, rgba(245, 245, 245, 0.1), rgba(0, 0, 0, 0.3))`,
      }}
    />

  
    {/* Overlay the quote/title */}
    {testimonialTitle && (
      <div
        className="fs-3 position-absolute bottom-0 start-50 translate-middle-x w-100 text-center text-white p-2 mb-4"
        // style={{background: 'rgba(0, 0, 0, 0.6)',}}
      >
        <RiDoubleQuotesL size={25}  className="mb-3 text-danger" />
        <strong>{testimonialTitle}</strong>
        <RiDoubleQuotesR size={25} className="mb-3 text-danger" />
      </div>
    )}
  </div>
  
  ) : (
    <Card.Img
      variant="top"
      src={image}
      className="w-100 h-100 object-fit-cover"
      alt="Static Banner"
    />
  )}
</Col>


      </Row>
    </Card>
  );
};

export default CourseBanner;
