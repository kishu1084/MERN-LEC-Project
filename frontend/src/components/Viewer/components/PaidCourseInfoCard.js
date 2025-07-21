import React from 'react';
import { Card, Row } from 'react-bootstrap';

const PaidCourseInfoCard = ({ line,id, children }) => {
  
  const {
    title,
    subTitle,
    description,
  }=line;
  
  return (
    <Card className="w-75 mx-2 my-5 rounded-5 border-0 d-flex flex-column " style={{ height: 'auto' }}>
      <Row
        className="flex-grow-1 g-0 container-fluid align-content-start rounded-5 p-4"
        style={{ boxShadow: '4px 4px 29px rgba(0, 0, 0, 0.15)' }}
      >
        { id===1 && (<><Card.Text className="fs-2 fw-bold text-danger mb-0 pb-0">
          {title}<span className='text-black'> {subTitle}</span>
        </Card.Text>

        <Card.Text className='fs-5 mt-4'>
          {description}
        </Card.Text></>)}

        { id===2 && (<><Card.Text className="fs-2 fw-bold text-black mb-0 pb-0">
          {title}<span className='text-danger'> {subTitle}?</span>
        </Card.Text>

        <Card.Text className='fs-5 mt-4'>
          {description}
        </Card.Text></>)}

        {children}
      </Row>
    </Card>
  );
};

export default PaidCourseInfoCard;
