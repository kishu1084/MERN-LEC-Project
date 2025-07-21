import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";


const StatsCard = ({ stats,type="Free" }) => {
  return (
    <Card
      className="mx-2 mt-5 rounded-5 d-flex flex-column border-danger border-1 border-light shadow-bottom"
      style={{ minHeight: "20vh", overflow: "hidden", minWidth: "65vw" }}
    >
      <Row className="flex-grow-1 g-0 container-fluid p-5">
        {stats.map((stat, index) => (
          <Col
            key={index}
            md={4}
            className={`d-flex align-items-center flex-column justify-content-center ${
              index !== stats.length - 1 ? "border-end border-2 border-light" : "border-0"
            }`}
          >
            {type==="Free" && ( <Card.Text className="fs-2 text-danger">
              <strong>{stat.value}</strong>
            </Card.Text>)}

            {type==="Premium" && ( <><i className={`${stat.icon} fs-1 text-danger mb-2`}></i> {/* Icon */}
            </>)}
            <Card.Text className={type === "Premium" ? 'fs-4 text-black' : ''}>{stat.label}</Card.Text>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default StatsCard;
