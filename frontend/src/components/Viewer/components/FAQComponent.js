import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../utills';
import { Card, Row, Col, Container, Button } from 'react-bootstrap';
import { BsPlus, BsDash } from 'react-icons/bs';
import 'bootstrap/dist/css/bootstrap.min.css';

function FAQComponent() {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showAll, setShowAll] = useState(false); // Toggle full list

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axiosInstance.get(`/all`);
        const activeFaqs = response.data.filter(faq => faq.status === 'Active');
        setFaqs(activeFaqs);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };
    fetchFaqs();
  }, []);

  const toggle = (index) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  const visibleFaqs = showAll ? faqs : faqs.slice(0, 5); // Show 5 or all

  return (
    <Row className="mb-0 container-fluid align-content-start">
          <Card.Text className="text-danger fs-1 mb-3">
            <strong>Frequently Asked Questions</strong>
          </Card.Text>
          <Container className="align-content-start m-0 p-0 mb-5">
              <Row className="w-100">
                  <Col md={10} className="border-0">
                  {visibleFaqs.map((faq, index) => (
                      <Card key={faq._id} className="border-0 border-bottom">
                      <Card.Header
                          onClick={() => toggle(index)}
                          className="d-flex justify-content-between align-items-center border-0 pb-3"
                          style={{ cursor: 'pointer', backgroundColor: '#ffffff' }}
                      >
                          <Card.Title
                          as="h5"
                          className={`mb-0 fs-4 mt-4 ${activeIndex === index ? 'text-danger' : 'text-dark'}`}
                          >
                          <strong>{faq.question}</strong>
                          </Card.Title>
                          <span className={`ms-3 fs-4 border-0 ${activeIndex === index ? 'text-danger' : 'text-dark'}`}>
                          {activeIndex === index ? <BsDash size={35} /> : <BsPlus size={35} />}
                          </span>
                      </Card.Header>
                      {activeIndex === index && (
                          <Card.Body>
                          <Card.Text>{faq.answer}</Card.Text>
                          </Card.Body>
                      )}
                      </Card>
                  ))}

                  {faqs.length > 5 && (
                      <div className="text-center mt-4">
                      <Button
                          variant="dark"
                          className='px-5'
                          onClick={() => setShowAll(prev => !prev)}
                      >
                          {showAll ? 'Show Less' : 'Show More'}
                      </Button>
                      </div>
                  )}
                  </Col>
              </Row>
          </Container>
    </Row>
  );
}

export default FAQComponent;
