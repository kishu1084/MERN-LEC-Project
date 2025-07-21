import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';

const PerfectForList = ({ secondLastWord, type="Free" }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {showMore && (
        <Card.Text>
          <Card.Text className='fs-4'>
            <strong>This Course Is Perfect For:</strong>
          </Card.Text>
          <Card.Text className='fs-4'>
            ✅ <strong>Students</strong> – Build future-ready skills with this free {secondLastWord} course for beginners and gain a strong foundation in coding.
          </Card.Text>
          <Card.Text className='fs-4'>
            ✅ <strong>Working Professionals</strong> – Learn how {secondLastWord} programming online can enhance productivity, automate tasks, and advance your career.
          </Card.Text>
          <Card.Text className='fs-4'>
            ✅ <strong>Entrepreneurs & Business Leaders</strong> – Discover how {secondLastWord} can optimize workflows, streamline operations, and support data-driven decision-making.
          </Card.Text>
          <Card.Text className='fs-4'>
            ✅ <strong>Tech Enthusiasts & Developers</strong> – Master the {secondLastWord} programming syllabus and explore real-world applications with hands-on projects.
          </Card.Text>
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

export default PerfectForList;
