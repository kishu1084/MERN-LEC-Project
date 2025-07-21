import React, { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col,Spinner, Modal } from "react-bootstrap";
import {  FaLinkedin, FaChevronLeft, FaChevronRight, FaRegStar } from "react-icons/fa";
import { API_URL } from "../../../utills";
import './TrainerCardList.css';
import { RiDoubleQuotesL} from "react-icons/ri";
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';


const Testimonials = () => {

  const [testimonials, setTestimonial] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTestimonials, setSelectedTestimonials] = useState(null);
  const testimonialsPerPage = 3;
  const [direction, setDirection] = useState(1);
  const fetchTestimonial = async () => {
    try {
          const res = await axios.get(`${API_URL}/testimonial/all`);
          setTestimonial(res.data);
        } catch (err) {
          console.log('Failed to fetch testimonial');
        }
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => Math.max(prev - testimonialsPerPage, 0));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) =>
      Math.min(prev + testimonialsPerPage, testimonials.length - testimonialsPerPage)
    );
  };

  const visibletestimonials = testimonials.slice(currentIndex, currentIndex + testimonialsPerPage);


  useEffect(() => {
    fetchTestimonial();
  },[])
  return (
    <Container className="py-5">
      <Container className="my-3 d-flex flex-column p-0">
        <Row className="container-fluid align-content-start">
        <Col>
            <strong>
              <p className="fw-bold text-start text-capitalize fs-6">WHAT OUR LEARNERS SAY</p>
              <p className="text-danger fs-1 text-start">
                  <span className="text-black">Real stories of</span> growth, success, and transformation
              </p>
            </strong>
        </Col>
        </Row>
    </Container>

      <div className="position-relative">
            {/* Left Button */}
            <Button
              className="custom-navigation-button position-absolute top-50 translate-middle-y z-2 rounded-circle d-flex align-items-center justify-content-center"
              style={{ left: '0', height: '40px', width: '40px' }}
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <FaChevronLeft />
            </Button>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ x: direction > 0 ? 100 : -100 }}
                animate={{  x: 0 }}
                transition={{ duration: 0.4 }}
              >
              <Row className="px-5 g-3">
                {visibletestimonials.map((testimonial, idx) => (
                  <Col md={4} key={idx} className="mb-4 d-flex">
                  <Card className=" h-100 d-flex border border-0">
                    
                    <Card className="border border-0 rounded-4 shadow-sm h-100">
                    <Card.Body className="d-flex flex-column">
                    <RiDoubleQuotesL
                      size={35}
                      color="#E43E48"
                      className="mb-2"
                      style={{ backgroundColor: "#fff" }}
                    />
                      <Card.Title className="fw-bold">{testimonial.title}</Card.Title>
                      
                      <Card.Text className="text-muted flex-grow-1 text-clamp">{testimonial.content}</Card.Text>
                      <div className="d-flex align-items-center">
                      <Button
                        variant="link"
                        className="p-0 m-0 text-black fs-6"
                        onClick={() => setSelectedTestimonials(testimonial)}
                      >
                        <strong className="text-start">Read More</strong>
                      </Button>
                      </div>
                        {testimonial.linkedIn && (
                            <div className="d-flex align-items-center mt-3">
                              <a
                                href={testimonial.linkedIn}
                                className="text-primary me-2 link"
                                target="_blank"
                                rel="noreferrer"
                              >
                                LinkedIn
                              </a>
                              <FaLinkedin size={24} color="#0e76a8" />
                          </div>
                        )}
                        
                      </Card.Body>
                    </Card>
                      <Card className=" mt-4 border border-0 text-start">
                        <Row className="g-1 w-100">
                          <Col md={3}>
                            <img
                              src={`${API_URL.replace('/api', '')}${testimonial.image}`}
                              alt={testimonial.name}
                              className="rounded-circle mb-2"
                              style={{ width: "80px", height: "80px", objectFit: "cover" }}
                            />
                        </Col>
                        <Col md={7}>
                          <h5 className="mb-0">{testimonial.name}</h5>
                          <small className="text-muted d-block">{testimonial.designation}</small>
                        </Col>
                      </Row>
                    </Card>
                    
                  </Card>
                </Col>
                
                ))}
              </Row>
            </motion.div>
                  </AnimatePresence>
                  <Button
                    className="custom-navigation-button position-absolute top-50 translate-middle-y z-2 rounded-circle d-flex align-items-center justify-content-center"
                    style={{ right: '0', height: '40px', width: '40px' }}
                    onClick={handleNext}
                    disabled={currentIndex + testimonialsPerPage >= testimonials.length}
                  >
                    <FaChevronRight />
                  </Button>
                </div>

                {/* testimonial Detail Modal */}
                      <Modal
                        show={!!selectedTestimonials}
                        onHide={() => setSelectedTestimonials(null)}
                        centered
                        size="lg"
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>
                            <strong>Testimonial</strong>
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">
                          
                          <Row className="g-0">
                            <Col md={1}>
                              <FaRegStar className="text-danger" />
                            </Col>
                            <Col md={11} className="text-start text-muted">
                              <span>{selectedTestimonials?.content}</span>
                            </Col>
                          </Row>
                          
                          <Row className="mt-5">
                          <Col md={8}><div className="d-flex justify-content-start">
                            {selectedTestimonials?.image && (
                              <img
                                src={`${API_URL.replace('/api', '')}${selectedTestimonials.image}`}
                                alt={selectedTestimonials.name}
                                className="rounded-circle mb-3"
                                style={{
                                  width: '80px',
                                  height: '80px',
                                  objectFit: 'cover',
                                  borderRadius: '20px',
                                }}
                              />
                            )}{' '}
                          </div>
                            <p className="text-start text-muted"><strong><span className="fs-3 text-black">{selectedTestimonials?.name}</span></strong><br/>
                            {selectedTestimonials?.designation}</p>
                            </Col>
                            <Col md={4} className="d-flex flex-column justify-content-end align-items-end">
                            {selectedTestimonials?.linkedIn && (
                            <a
                                href={selectedTestimonials.linkedIn}
                                target="_blank"
                                rel="noreferrer"
                                className="link mt-2 border-0 text-primary"
                                          style={{ textDecoration: 'underline', fontWeight: '500' }}
                              >
                                LinkedIn Profile <FaLinkedin size={24} color="#0e76a8" />
                              </a>
                          )}
                            </Col>

                            </Row>
                            
                        </Modal.Body>
                      </Modal>
    </Container>
  );
};

export default Testimonials;
