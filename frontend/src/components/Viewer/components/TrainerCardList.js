import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Spinner, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../../../utills';
import { HiOutlineUser } from 'react-icons/hi';
import './TrainerCardList.css';
import { FaChevronLeft, FaChevronRight, FaLinkedin, FaRegStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const TrainerCardList = ({id}) => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const trainersPerPage = 3;

  const fetchTrainers = async () => {
    try {
      const res = await axios.get(`${API_URL}/trainers/all`);
      setTrainers(res.data);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => Math.max(prev - trainersPerPage, 0));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) =>
      Math.min(prev + trainersPerPage, trainers.length - trainersPerPage)
    );
  };

  const visibleTrainers = trainers.slice(currentIndex, currentIndex + trainersPerPage);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5 px-5">
      
      <Row className="container-fluid align-content-start px-5">
      <Col>
          { id==1 && (<strong>
          <h6 className="fw-bold text-start">OUR TRAINERS, YOUR ADVANTAGE</h6>
          <p className="text-danger fs-1 text-start mb-5">
              <span className="text-black">Unlock your potential with</span> expert-led training
          </p>
          </strong>)}
          { id==2 && (<strong>
          <h6 className="fw-bold text-start fs-6">Instructors</h6>
          <p className="text-danger fs-1 text-start mb-5">
              <span className="text-black">Whom Will</span> You Learn From?
          </p>
          </strong>)}
          <div className="custom-heading mb-5">
          <h5 className="heading-text fs-6">Instructors</h5>
          <div className="line-wrapper">
            <div className="red-line"></div>
            <div className="gray-line"></div>
          </div>
        </div>
      </Col>
      </Row>
 
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
          <Row className="px-5">
            {visibleTrainers.map((trainer) => (
              <Col md={4} sm={6} xs={12} key={trainer._id} className="mb-4">
                <Card className="h-100 shadow-sm rounded-4">
                  <Card.Img
                    variant="top"
                    src={`${API_URL.replace('/api', '')}${trainer.image}`}
                    alt={trainer.name}
                    className="px-3 pt-3 pb-0 rounded-4"
                    style={{ height: '230px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title className="fs-5 mt-0"><strong>{trainer.name}</strong></Card.Title>
                    <Card.Subtitle className="fs-6 text-muted">
                      {trainer.designation}
                    </Card.Subtitle>
                    <Card.Text className="text-clamp m-0 fs-6">
                      {trainer.quickIntro}
                    </Card.Text>
                    <Button
                      variant="link"
                      className="p-0 m-0 text-black fs-6"
                      onClick={() => setSelectedTrainer(trainer)}
                    >
                      <strong>Read More</strong>
                    </Button>
                    {trainer.linkedIn && (
                      <div className="d-flex justify-content-start m-0">
                        <a
                          href={trainer.linkedIn}
                          target="_blank"
                          rel="noreferrer"
                          className="link mt-2 border-0 text-primary"
                          style={{ textDecoration: 'underline', fontWeight: '500' }}
                        >
                          LinkedIn Profile <FaLinkedin size={24} color="#0e76a8" />
                        </a>

                      </div>
                    )}
                  </Card.Body>
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
        disabled={currentIndex + trainersPerPage >= trainers.length}
      >
        <FaChevronRight />
      </Button>
    </div>


      {/* Trainer Detail Modal */}
      <Modal
        show={!!selectedTrainer}
        onHide={() => setSelectedTrainer(null)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedTrainer?.image && (
              <img
                src={`${API_URL.replace('/api', '')}${selectedTrainer.image}`}
                alt={selectedTrainer.name}
                className="rounded-circle mb-3"
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '20px',
                }}
              />
            )}{' '}
            {selectedTrainer?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Row className="g-0">
            <Col md={1}>
              <HiOutlineUser className="text-danger" />
            </Col>
            <Col md={11}>
              <p className="text-start text-muted">{selectedTrainer?.designation}</p>
            </Col>
          </Row>
          <Row className="g-0">
            <Col md={1}>
              <FaRegStar className="text-danger" />
            </Col>
            <Col md={11} className="text-start text-muted">
              <span>{selectedTrainer?.quickIntro}</span>
            </Col>
          </Row>
          {selectedTrainer?.linkedIn && (
            <div className="d-flex justify-content-start p-3">
              <a
                href={selectedTrainer.linkedIn}
                target="_blank"
                rel="noreferrer"
                className="link mt-2 border-0 text-primary"
                          style={{ textDecoration: 'underline', fontWeight: '500' }}
              >
                LinkedIn Profile <FaLinkedin />
              </a>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default TrainerCardList;
