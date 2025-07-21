    import { useState } from "react";
    import axios from "axios";
    import { Modal, Button, Form, Card, ProgressBar, Col, Row, Spinner } from "react-bootstrap";
    import { ToastContainer, toast } from "react-toastify";
    import { FaClock, FaEnvelopeOpenText, FaSyncAlt, FaEnvelope, FaInfoCircle, FaEnvelopeOpen } from "react-icons/fa";
    import "react-toastify/dist/ReactToastify.css";
    import DatePicker from "react-datepicker";
    import "react-datepicker/dist/react-datepicker.css";
    import { motion } from "framer-motion";
    import "./CounselingForm.css"; // Import custom CSS
    import IMG from '../components/inquire.jpg';
    import Confetti from "react-confetti";
    import successIMG from './sucuess.avif';
    import { checkCounselingStatus, submitCounselingInquiry } from "../../../API/cousellingRequestAPI";
    import { Link } from "react-router-dom";
    import processingImg from './processingIMG.png';


    const CounselingForm = ({ userData, onClose }) => {
    const [step, setStep] = useState(1);
    
    const [user] = useState(userData[0] || { name: "", email: "",phone: "" });
    const [formData, setFormData] = useState({
        name: `${user.name}`,
        email: `${user.email}`,
        phone: `${user.phone}`,
        message: "",
        appointmentDate: null,
        contactStartTime: null,
        contactEndTime: null,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setFormData((prev) => ({ ...prev, appointmentDate: date }));
    };
    

    const handleTimeChange = (field, time) => {
        setFormData({ ...formData, [field]: time });
    };

    const preCheckAndSubmit =  async (e) => {
        e.preventDefault();
      setLoading(true);
    
      
        const email = user.email;
    
      const check = await checkCounselingStatus(email);
      if (check.exists) {
        setLoading(false);
          toast.warning("You already have a pending request for Counselling.");
          setStep(4);
          return;
      }
      else {
        handleSubmit(e);
        
      }
    
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!formData.appointmentDate || !formData.contactStartTime || !formData.contactEndTime || !formData.message.trim()) {
            toast.error("Please fill all fields.");
            setLoading(false);
            return;
        }
        
        try {
            await submitCounselingInquiry(formData);
            setTimeout(() => {
                setLoading(false);
                setStep(3);
                toast.success("Inquiry submitted successfully!");
            }, 1500);
        } catch (error) {
            setLoading(false);
            toast.error("Error submitting inquiry.");
        }
    };
    

    return (
        <>
        <Modal show onHide={onClose} centered backdrop="static" size="xl" className="p-0">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
            

            <Modal.Body className="px-4">
                <ProgressBar now={step === 1 ? 50 : (step === 2 ? 90 : 100)} variant="danger" className="mb-3 custom-progress-bar" />
                <Modal.Header closeButton className="border-0 mt-2"/>
                {step < 3 && (<div style={{ width: "100%", textAlign: "center" }}>
                    <Card.Img src={IMG} style={{ width: "300px", height: "200px", objectFit: "cover", borderRadius: "10px" }} />
                </div>)}
                
                <Modal.Title className="fw-bold text-danger my-2">Get Counseling</Modal.Title>


                {step === 1 && (
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                    <Form>
                    <Form.Group className="mb-3">
                        <Form.Control type="text" name="name" placeholder="Enter your name" value={formData.name} className="custom-input" readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control type="email" name="email" placeholder="Enter your email" value={formData.email}  className="custom-input" readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control type="tel" name="phone" placeholder="Enter your phone number" value={formData.phone}  className="custom-input" readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control as="textarea" name="message" rows={3} placeholder="Write your message" value={formData.message} onChange={handleChange} className="custom-input" required />
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                        <Button variant="danger" onClick={() => setStep(2)}>Next ➝</Button>
                    </div>
                    </Form>
                </motion.div>
                )}

                {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                    <Form onSubmit={preCheckAndSubmit}>
                    <Card className="p-2 mb-3 shadow-sm rounded-3">
                        <h5 className="text-center text-black fs-3 my-2"><strong>Select Date & Time</strong></h5><hr></hr>
                        <Row className="g-1  justify-content-center text-center">

                            <Col md={6} className="d-flex flex-column align-items-center mt-0">
                                <p className="fw-semibold text-danger">Appointment Date</p>
                                <DatePicker
                                    selected={formData.appointmentDate}
                                    onChange={handleDateChange}
                                    minDate={new Date()}
                                    inline
                                    calendarClassName="custom-calendar"
                                    dayClassName={(date) => {
                                        return formData.appointmentDate &&
                                        date.getDate() === formData.appointmentDate.getDate() &&
                                        date.getMonth() === formData.appointmentDate.getMonth() &&
                                        date.getFullYear() === formData.appointmentDate.getFullYear()
                                        ? "selected-date"
                                        : "default-date";
                                    }}
                                    />

                            </Col>

                            <Col md={2} className="d-flex flex-column align-items-center mt-0">
                                
                                <p className="fw-semibold text-danger">Start Time</p>
                                <DatePicker
                                selected={formData.contactStartTime}
                                onChange={(time) => handleTimeChange("contactStartTime", time)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Start"
                                dateFormat="h:mm aa"
                                inline
                                
                                />

                            </Col>

                            <Col md={2} className="d-flex flex-column align-items-center mt-0">

                                <p className="fw-semibold text-danger">End Time</p>
                                <DatePicker
                                selected={formData.contactEndTime}
                                onChange={(time) => handleTimeChange("contactEndTime", time)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="End"
                                dateFormat="h:mm aa"
                                inline
                                className="form-control time-picker"
                                />
                            </Col>
                            </Row>

                    </Card>

                    <Card.Text className="fs-5 text-danger"><strong>Don’t Miss Out! Complete the Form Now !</strong></Card.Text>

                    <div className="d-flex justify-content-between mt-4">
                        <Button variant="outline-danger" className="back-btn" onClick={() => setStep(1)}>← Back</Button>
                        <Button variant="danger" type="submit" className="custom-submit-btn" disabled={loading}>{loading ? <Spinner animation="border" size="sm" /> : "Submit ✔"}</Button>
                    </div>
                    </Form>
                </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Confetti numberOfPieces={150} recycle={false} />
                        <Card className="text-center p-4">
                            <Card.Img variant="top" src={successIMG} className="mx-auto" style={{ width: "150px" }} />
                            <Card.Title className="fw-bold text-success mt-2">✅ Thank you for reaching out!</Card.Title>
                            <Card.Text>We've received your inquiry and will get back to you shortly.</Card.Text>
                            <div className="d-flex justify-content-center gap-3">
                                <Button 
                                    variant="outline-danger"
                                    as={Link}
                                    to="/ExclusiveCourses/#topbanner"
                                >Explore Courses</Button>
                                <Button variant="outline-dark" onClick={onClose}>Return to Home</Button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                 {step === 4 && (
                          <motion.div 
                            initial={{ opacity: 0, y: -20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.3 }}
                          >
                            <Card className="text-center p-4">
                              <Card.Img variant="top" src={processingImg} className="mx-auto" style={{ width: "310px", height:"350px" }} />
                              <Card.Title className="fw-bold text-danger"> Request Under Process</Card.Title>
                              <Card.Text className="fs-5">Thank you for reaching out to us!</Card.Text>
                              
                              <Card.Text className="text-muted">
                                <FaInfoCircle className="me-2 text-muted" /> Our team has received your request. We’ll review it and get back to you shortly.
                              </Card.Text>
                
                              <Card.Text className="text-warning fw-semibold mt-3">
                                <FaClock className="me-1" /> Please allow up to <strong>24-48 hours</strong> for a response.
                              </Card.Text>
                
                              <Card.Text className="text-muted mt-3">
                                <FaEnvelopeOpen className="me-2 text-muted" /> For urgent queries, email us at <br />
                                <strong>support@ssmlec.com</strong>
                              </Card.Text>
                
                              <div className="d-flex justify-content-between gap-3">
                                <Button 
                                    variant="outline-danger"
                                    as={Link}
                                    to="/ExclusiveCourses/#topbanner"
                                >Browse More Courses</Button>
                                <Button variant="outline-dark" onClick={onClose}>Close</Button>
                              </div>
                            </Card>
                          </motion.div>
                        )}
            </Modal.Body>
            </motion.div>
        </Modal>
        <ToastContainer />
        </>
    );
    };

    export default CounselingForm;
