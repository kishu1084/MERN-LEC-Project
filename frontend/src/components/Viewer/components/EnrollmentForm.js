import React, { useState } from "react";
import { Modal, Button,  Card, ProgressBar, Col, Row, Container, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { IMAGE_URL } from "../../../utills";
import { FaClock, FaEnvelopeOpenText, FaSyncAlt, FaEnvelope, FaInfoCircle, FaEnvelopeOpen } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import './EnrollFormStyle.css';
import successIMG from './enrollment_img.jpg';
import welcomeIMG from './welcome.png';
import endIMG from './enrollmentLastStep.webp';
import processingImg from './processingIMG.png';
import { submitCourseEnrollment, checkEnrollmentStatus } from "../../../API/courseEnrollmentAPI";


const EnrollmentForm = ({ course,userData, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [user] = useState(userData[0] || { name: "", email: "",phone: "" });

  const sendEmail = async () => {
    const emailData = {
      to: `${user.email}`,
      subject: "Enrollment Confirmation – Complete Your Payment to Secure Your Seat",
      message: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #4CAF50;">Enrollment Successful! 🎉</h2>
          <p>Dear <strong>${user.name}</strong>,</p>
    
          <p>Congratulations! You have successfully enrolled in the <strong>${course.name}</strong> course.</p>
    
          <p>
            We have sent you a separate email with the payment details.
            Please complete the payment within <strong>24 hours</strong> to secure your seat,
            as spots are limited and available on a first-come, first-served basis.
          </p>
    
          <p>If you have already completed the payment, you may ignore this message.</p>
    
          <p>Feel free to contact us if you have any questions or need assistance.</p>
    
          <br/>
          <p>Best regards,<br/>The <strong>SSM LEC Head</strong></p>
        </div>
      `
    };
    

    try {
        const response = await fetch("http://localhost:5000/api/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailData),
        });

        const result = await response.json();
        if (result.success) {
          toast.success("Email sent successfully!");
        } else {
          toast.error("Failed to send email!");
        }
    } catch (error) {
        console.error("Error:", error);
        toast.error("Error sending email!");
    }
};


const handleSubmit = async (e) => {
  
  setLoading(true);

  const enrollmentData = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    courseName: course.name,
    courseId: course._id,
    fee: course.fee,
  };

  // 2. Proceed with new enrollment if not already enrolled
  const result = await submitCourseEnrollment(enrollmentData);

  if (result.success) {
    toast.success("Enrollment Form submitted successfully!");
    setStep(3);
    sendEmail();
  } else {
    toast.error(result.message || "Something went wrong!");
  }

  setLoading(false);
};

const preCheckAndSubmit =  async (courseId) => {
 
  setLoading(true);

  
    const email = user.email;
    

  const check = await checkEnrollmentStatus(email, courseId);
  if (check.exists) {
      toast.warning("You already have a pending request for this course.");
      setStep(4);
      return;
  }
  else {
    handleSubmit();
  }

}


  return (
    <Modal show onHide={onClose} centered backdrop="static" size="lg">
      <Modal.Header closeButton className="border-0"></Modal.Header>
      <Modal.Body className="px-4">
        <ProgressBar now={step === 1 ? 50 : (step === 2 ? 95 : 100)} variant="danger" className="mb-3 custom-progress-bar" />

        {/* Step 1: Welcome */}
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.3 }}
            className="w-100"
          > 
            <Card className="text-center p-4 border-0">
              <Card.Img variant="top" src={welcomeIMG} className="mx-auto" style={{ width: "390px", height:"200px" }} />
              <Card.Text className="fs-4"><strong>Hey {user.name} !</strong></Card.Text>
              <Card.Text className="fs-4">
                <strong>Welcome to <span className="text-danger">SSM LEC</span></strong>
              </Card.Text>
              <Card.Text className="text-muted">You are applying for:</Card.Text>

              {/* Course Info Card */}
              <Container fluid className="p-0 w-100 d-flex justify-content-center">
                <Row className="w-75 g-2 border rounded p-2 align-items-center">
                  <Col md={4} className="d-flex justify-content-center">
                    <Card.Img
                      variant="top"
                      src={`${IMAGE_URL}/${course.image}`}
                      alt="Course Image"
                      className="w-100 object-fit-cover rounded"
                    />
                  </Col>
                  <Col md={8} className="p-0 text-start px-4">
                    <Card.Text className="fs-5 fw-bold m-0">{course.name}</Card.Text>
                    <Card.Text className="text-muted m-0">With SSM LEC</Card.Text>
                    <Card.Text className="text-muted m-0">Type: {course.type}</Card.Text>
                    <Card.Text className="text-muted m-0">Duration: {course.duration}</Card.Text>
                  </Col>
                </Row>
              </Container>

              {/* Admission Process Stepper */}
              <Card.Text className="text-muted mt-3">Admission Process: </Card.Text>
              <Container className="stepper-container">
                <Row className="w-100 d-flex align-items-center">
                  
                  {/* Step 1 - Screening Round */}
                  <Col className="text-start mx-0 px-0" md={2}>
                    <div className="step-circle active">
                      <div className="inner-circle"></div>
                    </div>
                    <p className="fw-bold text-success m-0">Screening Round</p>
                    <p className="text-muted m-0"><FaClock className="me-1" /> 3 mins</p>
                  </Col>


                  {/* Connecting Line */}
                  <Col className="px-2" md={8}>
                    <div className={`step-line ${step > 1 ? "active" : ""}`}></div>
                  </Col>

                  {/* Step 2 - Reserve a Seat */}
                  <Col className="text-start m-0 p-0"  md={2}>
                    <div className={`step-circle ${step > 1 ? "active" : ""}`}>
                      <div className="inner-circle"></div>
                    </div>
                    <p className="fw-bold text-secondary m-0">Reserve a Seat</p>
                    <p className="text-muted m-0"><FaClock className="me-1" /> 3 mins</p>
                  </Col>
                </Row>
              </Container>

              <Button variant="danger" className="mt-3" onClick={() => setStep(2)}>Proceed →</Button>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Confirm Details */}
        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.3 }}

          >
            <Card className="p-3 border border-0">
              <Card.Img variant="top" src={endIMG} className="mx-auto" style={{ width: "400px", height:"280px" }} />
              <Card.Title className="text-danger text-center">Confirm Your Details</Card.Title>
              <Card className="px-5 py-3">
              
                <Card.Text className="m-1"><strong>Name: </strong> {user.name}</Card.Text>
                <Card.Text className="m-1"><strong>Email: </strong> {user.email}</Card.Text>
                <Card.Text className="m-1"><strong>Phone: </strong> {user.phone}</Card.Text>
                <Card.Text className="m-1"><strong>Course: </strong> {course.name}</Card.Text>
                <Card.Text className="m-1"><strong>Course Fees: </strong> {course.fee}</Card.Text>
              </Card>

              {/* Admission Process Stepper */}
              <Card.Text className="text-muted mt-3">Admission Process: </Card.Text>
              <Container className="stepper-container">
                <Row className="w-100 d-flex align-items-center">
                  
                  {/* Step 1 - Screening Round */}
                  <Col className="text-start mx-0 px-0" md={2}>
                    <div className="step-circle active">
                      <div className="inner-circle"></div>
                    </div>
                    <p className="fw-bold text-success m-0">Screening Round</p>
                    <p className="text-muted m-0"><FaClock className="me-1" /> 3 mins</p>
                  </Col>


                  {/* Connecting Line */}
                  <Col className="px-2" md={8}>
                    <div className={`step-line ${step > 1 ? "active" : ""}`}></div>
                  </Col>

                  {/* Step 2 - Reserve a Seat */}
                  <Col className="text-start m-0 p-0"  md={2}>
                    <div className={`step-circle ${step > 1 ? "active" : ""}`}>
                      <div className="inner-circle"></div>
                    </div>
                    <p className="fw-bold text-secondary m-0">Reserve a Seat</p>
                    <p className="text-muted m-0"><FaClock className="me-1" /> 3 mins</p>
                  </Col>
                </Row>
              </Container>

              <Card.Text className="fs-5 text-danger"><strong>You're Almost There! Just One More Step to Go !</strong></Card.Text>

              <div className="d-flex justify-content-between mt-4">
                <Button variant="outline-danger" onClick={() => setStep(1)}>← Back</Button>
                <Button variant="danger" onClick={()=>preCheckAndSubmit(course._id)}disabled={loading}>{loading ? <Spinner animation="border" size="sm" /> : "Submit ✔"}</Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Success Message */}
        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
          >
            <Confetti numberOfPieces={150} recycle={false} />
            <Card className="text-center p-4">
              <Card.Img variant="top" src={successIMG} className="mx-auto" style={{ width: "290px", height:"200px" }} />
              <Card.Title className="fw-bold text-success">✅ Enrollment Successful!</Card.Title>
              <Card.Text className="fs-5">Thank you for enrolling!</Card.Text>
              <Card.Text className="text-muted">
              <FaEnvelope className="me-2 text-muted" /> Payment details have been sent to your registered email. <br />
                Please check your inbox (and spam folder just in case). <br />
                We look forward to welcoming you soon!
              </Card.Text>

              <Card.Text className="text-danger fw-semibold mt-3">
              <FaClock className="me-1" /> Complete your payment within <strong>24 hours</strong> to confirm your spot.
              </Card.Text>

              <Card.Text className="mt-3">
              <FaSyncAlt className="me-2 text-muted" /> Didn’t receive the email? <Button variant="link" onClick={sendEmail} className="p-0 text-decoration-none text-danger fw-semibold">Click here to resend</Button>

              </Card.Text>

              <Card.Text className="text-muted">
              <FaEnvelopeOpenText className="me-2 text-muted" /> For any questions, feel free to reach out to us at <br />
                <strong>support@ssmlec.com</strong>
              </Card.Text>
              <div className="d-flex justify-content-between gap-3">
                <Button 
                    variant="outline-danger"
                    as={Link}
                    to="/ExclusiveCourses/#topbanner"
                >Explore Courses</Button>
                <Button variant="outline-dark" onClick={onClose}>Close</Button>
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
      <ToastContainer />
    </Modal>
  );
};

export default EnrollmentForm;
