import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Img from './Unauthorized.png'; // (optional image)

const UnauthorizedPage = () => {
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
              alt="Unauthorized Access"
              style={{ maxWidth: "300px", marginBottom: "20px" }}
            />
            <h4 style={{ marginBottom: "20px", color: "#6c757d" }}>
              You do not have permission to view this page.
            </h4>
            <Button variant="danger" onClick={handleGoHome}>
              Go to Home
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UnauthorizedPage;
