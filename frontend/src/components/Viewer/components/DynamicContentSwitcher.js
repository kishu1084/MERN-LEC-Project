import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import "../pages/Style.css";

const DynamicContentSwitcher = ({ contentData }) => {
  const firstKey = Object.keys(contentData)[0]; // Get the first key
  const [activeButton, setActiveButton] = useState(firstKey);
  const [activeContent, setActiveContent] = useState(contentData[firstKey]);

  useEffect(() => {
    setActiveButton(firstKey);
    setActiveContent(contentData[firstKey]);
  }, [contentData]); // Update state if contentData changes

  const handleButtonClick = (buttonKey) => {
    setActiveButton(buttonKey);
    setActiveContent(contentData[buttonKey]);
  };

  return (
    <Card className="w-75 mx-auto my-5 rounded-5 border-0 p-4">
      <div id="section2" className="h-auto p-0 justify-content-center align-content-center mt-5 mb-5">
        <Container className="mt-3 d-flex flex-column p-0">
            <Row className="container-fluid align-content-start">
            <Col>
                <strong>
                <h6 className="fw-bold text-start">Offering</h6>
                <p className="text-black fs-1 text-start">
                    <span className="text-danger">How can</span> SSM LEC support you?
                </p>
                </strong>
            </Col>
            </Row>
        </Container>

        
        </div>
      <Row className="d-flex align-items-start">
        {/* Buttons Column */}
        <Col md={4}>
          <div className="d-flex flex-column gap-3">
            {Object.keys(contentData).map((key) => (
              <Button
                key={key}
                className={`custom-border-muted-button text-muted fs-4 ${
                  activeButton === key ? "custom-border-muted-button-active" : "custom-border-muted-button"
                }`}
                onClick={() => handleButtonClick(key)}
              >
                <strong>{contentData[key].title}</strong>
              </Button>
            ))}
          </div>
        </Col>

        {/* Content Display Column */}
        <Col md={7} className="d-flex align-items-start m-0" style={{ paddingLeft: "30px" }}>
          <Card className="p-0 border-0 text-start w-100">
            <Card.Body className="p-0">
              <Card.Title className="fs-4 fw-bold">{activeContent.title}</Card.Title>
              <ul className="fs-5 m-0 list-unstyled">
                {activeContent.points.map((point, index) => (
                  <li key={index} className="d-flex align-items-center mb-2">
                    <FaCheckCircle className="text-white me-2 bg-danger rounded-5" />
                    <span className="text-black">{point}</span>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default DynamicContentSwitcher;
