import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Img from './NotFound.png';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="w-100 min-vh-100 d-flex justify-content-center align-items-center">
      <Container className="text-center">
        <Row className="justify-content-center">
          <Col md={8} onClick={handleGoHome} style={{ cursor: "pointer" }}>
            <img
              src={Img}
              alt="404 Not Found"
              style={{ maxWidth: "300px", marginBottom: "20px" }}
            />
            <h4 style={{ marginBottom: "20px", color: "#6c757d" }}>
              Oops! The page you're looking for doesn't exist.
            </h4>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFoundPage;
