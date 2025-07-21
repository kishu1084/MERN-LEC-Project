import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaPhone } from "react-icons/fa";
import "../pages/Style.css";

const LearnerSupportCard = () => {
  return (
    <Card
      className="mx-2 mt-5 d-flex flex-column border-0 w-100 mb-5"
      style={{ paddingLeft: "12%", height: "300px" }}
    >
      <Card.Text className="fs-1 text-black mb-0">
        <strong>
          SSM LEC <span className="text-danger">Learner Support</span>
        </strong>
      </Card.Text>

      <Card.Text className="fs-5 text-muted">
        Talk to our experts. We are available 7 days a week, 9 AM to 12 AM (midnight)
      </Card.Text>

      <Row md={6} className="g-0 p-0">
        <Col>
          <button
            className="border-0 fs-4 bg-white m-0"
            style={{ padding: "5% 0%" }}
          >
            Indian Nationals
          </button>
        </Col>

        <Col>
          <button
            className="cutom-coursetype-button"
            style={{ border: "#dc3545 solid 0.5px", padding: "5% 5%" }}
          >
            <FaPhone className="text-danger me-3" size={20} />
            <strong className="fs-4">1800 210 2020</strong>
          </button>
        </Col>
      </Row>
    </Card>
  );
};

export default LearnerSupportCard;
