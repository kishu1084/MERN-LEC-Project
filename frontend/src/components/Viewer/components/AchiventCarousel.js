import React, { useRef, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IMAGE_URL } from '../../../utills';
import "../pages/Style.css";

const AchiventCarousel = ({ achivementList }) => {
  
  const scrollRef = useRef();

  // 🔁 Duplicate the achievement list to simulate infinite scroll
  const extendedList = [...achivementList, ...achivementList];

  useEffect(() => {
    const container = scrollRef.current;
    const cardWidth = container.offsetWidth / 4;

    const autoScroll = () => {
      if (container) {
        container.scrollBy({ left: cardWidth, behavior: 'smooth' });

        // Reset scroll position to start (first card) when halfway (original list end)
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollTo({ left: 0, behavior: 'auto' });
        }
      }
    };

    const interval = setInterval(autoScroll, 2000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const scrollByCard = (direction = 'next') => {
    const container = scrollRef.current;
    if (container) {
      const cardWidth = container.offsetWidth / 4;
      const scrollAmount = direction === 'next' ? cardWidth : -cardWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="position-relative w-100 px-5" style={{ paddingLeft: '10%', paddingRight: '10%' }}>
      {/* Left Navigation */}
      <Button
        className="custom-navigation-button position-absolute top-50 translate-middle-y z-2 rounded-circle d-flex align-items-center justify-content-center"
        style={{ left: '7%', height: '40px', width: '40px' }}
        onClick={() => scrollByCard('prev')}
      >
        <FaChevronLeft />
      </Button>

      {/* Card Carousel */}
      <Card className="d-flex flex-column border-0 w-100 pt-0 h-auto" style={{ padding: '0% 10%', boxSizing: 'border-box' }}>
        <div
          ref={scrollRef}
          className="d-flex overflow-hidden h-auto w-100 m-0"
          style={{ scrollBehavior: 'smooth', gap: '1rem', padding: '1% 0%', boxSizing: 'border-box' }}
        >
          {extendedList.map((achivement, index) => (
            <div key={`${achivement._id}-${index}`} style={{ width: '25%', flex: '0 0 auto' }}>
              <Card className="h-100 d-flex flex-column rounded-4 border-0 overflow-hidden achivement-card">

                {/* Image and Date */}
                <div className="position-relative">
                  {achivement.image && (
                    <Card.Img
                      variant="top"
                      src={`${IMAGE_URL}/${achivement.image}`}
                      alt="achievement"
                      className="w-100 object-fit-cover achivement-card-img"
                    />
                  )}
                  <span
                    className="position-absolute bottom-0 end-0 px-2 py-1 bg-white text-danger border border-1 border-muted rounded-top-end rounded-1 text-uppercase fs-6 fw-semibold z-3"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {new Date(achivement.date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {/* Title + Content */}
                <Card.Body className="d-flex flex-column p-3">
                  <Card.Title className="fw-bold fs-6 mb-2 text-black">{achivement.title}</Card.Title>
                  <Card.Text className="text-secondary mb-1" style={{ fontSize: '0.71rem' }}>
                    {achivement.content}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </Card>

      {/* Right Navigation */}
      <Button
        className="custom-navigation-button position-absolute top-50 translate-middle-y z-2 rounded-circle d-flex align-items-center justify-content-center"
        style={{ right: '7%', height: '40px', width: '40px' }}
        onClick={() => scrollByCard('next')}
      >
        <FaChevronRight />
      </Button>
    </div>
  );
};

export default AchiventCarousel;
