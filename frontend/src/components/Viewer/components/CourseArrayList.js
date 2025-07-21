import React, { useState } from "react";
import { Card, Col, Button } from "react-bootstrap";

const CourseArrayList = ({ data }) => {
  const [showMore, setShowMore] = useState(false);

  return (
      <Card className='border border-0'>
          {showMore && data.points.map((point, index) => (
            <Col md={12} className="mb-4" key={index}>
              <Card className="p-3 border-0">
                <Card.Title className="fs-4 fw-bold">{point.title}</Card.Title>
                <ul>
                  {point.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
                <strong>Best For:</strong> {point.bestFor}
              </Card>
            </Col>
          ))}

          <div className='mt-3 text-end'>
            <Button
              className="border-0 text-danger bg-transparent text-decoration-underline fs-5"
              onClick={() => setShowMore(!showMore)}
            >
              <strong>{showMore ? 'Read Less' : 'Read More'}</strong>
            </Button>
          </div>
        </Card>
  );
};

export default CourseArrayList;
