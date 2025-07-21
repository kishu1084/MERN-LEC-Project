import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';

const CourseDetailsComponent = ({ details = [] }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {showMore && (
        <Card.Text>
          {details.map((detail, index) => (
            <div key={index}>
              <Card.Text className='fs-4'>
                <strong>{detail.title}</strong>
              </Card.Text>
              <ul>
                {detail.content.map((text, idx) => (
                  <li key={idx} className='fs-5'>{text}</li>
                ))}
              </ul>
            </div>
          ))}
        </Card.Text>
      )}

      <div className='mt-3 text-end'>
        <Button
          className="border-0 text-danger bg-transparent text-decoration-underline fs-5"
          onClick={() => setShowMore(!showMore)}
        >
          <strong>{showMore ? 'Read Less' : 'Read More'}</strong>
        </Button>
      </div>
    </>
  );
};

export default CourseDetailsComponent;
