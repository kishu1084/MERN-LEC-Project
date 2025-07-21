import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { FaChevronRight } from 'react-icons/fa';
import { IMAGE_URL } from "../../../utills";
import "../pages/Style.css";
import { useState } from "react";
import EnrollmentForm from "./EnrollmentForm";
import { useAuth } from "../../../context/AuthContext";
import AuthModal from "../../pages/AuthModal";
import './TrainerCardList.css';

export default function CourseListSection({
  filterType,
  setFilterType,
  filterOptions = ["Software", "Corporate", "All"],
  visibleCourses = [],
  courseList = [],
  handleViewDetails,
  showAll,
  setShowAll,
  marginLeft = "0%",
  flag = "1"
}) {

    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
    const [userData, setUserData] = useState([]);

    const handleEnrollmentClick = () => {
      if (!user) {
        setUserData([{ name: user.name, email: user.email, phone: user.phone }]);
        setIsOpen(true);
        return;
      }
      setUserData([{ name: user.name, email: user.email, phone: user.phone }]);
      console.log(userData);
      setShowEnrollmentForm(true);
    };
  return (
    <Row className="w-100 px-5" style={{ marginLeft }}>
      {/* ✅ Dynamic Filter Buttons */}
      <Col md={2} className="d-flex flex-column gap-3">
        {filterOptions.map((option) => (
          <button
            key={option}
            onClick={() => {
                console.log(`Filter changed to: ${option}`);
                setFilterType(option);
            }}
            className={filterType === option ? 'cutom-coursetype-button-active fs-5' : 'cutom-coursetype-button fs-5'}
          >
            <strong>{option}</strong> <FaChevronRight />
          </button>
        ))}
      </Col>

      {/* ✅ Display Filtered Courses */}
      <Col md={8}>
        <Card className="d-flex flex-column border-0 w-100">
          <Row className="g-5">
            {visibleCourses.length > 0 ? (
              visibleCourses.map((course) => (
                <Col md={4} key={course._id || course.name} className="mb-4">
                  <Card className="h-100 d-flex flex-column rounded-4 border border-1 border-muted overflow-hidden course-card">
                    <span className="position-absolute top-0 end-0 bg-white text-danger px-2 py-1 rounded-bottom-start text-uppercase fs-6 fw-semibold z-3">
                      {course.subscription}
                    </span>
                    {course.image && (
                      <Card.Img
                        variant="top"
                        src={`${IMAGE_URL}/${course.image}`}
                        alt="Course Image"
                        className="w-100 object-fit-cover course-card-img"
                      />
                    )}
                    <Card.Body className="d-flex flex-column p-3">
                      <Card.Title className="fw-bold fs-5 mb-2 text-black">
                        {course.name}
                      </Card.Title>
                      <Card.Text className="text-secondary mb-1 text-clamp">
                        <strong className="text-dark">Skills:</strong> {course.outcome}
                      </Card.Text>
                      <Card.Text className="text-secondary mb-1">
                        <strong className="text-dark">Duration:</strong> {course.duration}
                      </Card.Text>
                      <Card.Text className="text-secondary mb-3">
                        <strong className="text-dark">Course Type:</strong> {course.type}
                      </Card.Text>

                      <div className="d-flex gap-3 mt-auto w-100 justify-content-between">
                        <Button
                          size="sm"
                          className="flex-grow-1 custom-border-button"
                          onClick={() => handleViewDetails(course)}
                        >
                          View Program
                        </Button>
                        <Button variant="danger" size="sm" className="flex-grow-1" onClick={handleEnrollmentClick}>
                          Enroll Now
                        </Button>
                        {showEnrollmentForm && <EnrollmentForm course={course} userData={userData} onClose={() => setShowEnrollmentForm(false)} />}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p className="text-center w-100 text-muted">No courses available for this category.</p>
            )}
          </Row>

          {/* ✅ Show More/Less Button */}
          {(courseList.length > 3 && flag === "1") && (
            <div className="text-center mt-4">
              <Button variant="dark" onClick={() => setShowAll(prev => !prev)}>
                {showAll ? 'Show Less' : 'Show More'}
              </Button>
            </div>
          )}
        </Card>
      </Col>
      {isOpen && <AuthModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </Row>
  );
}
