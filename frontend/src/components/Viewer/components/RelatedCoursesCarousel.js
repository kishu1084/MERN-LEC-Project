import React, { useRef, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IMAGE_URL } from "../../../utills";
import { useNavigate } from "react-router-dom";
import "../pages/Style.css";
import { useAuth } from "../../../context/AuthContext";
import AuthModal from "../../pages/AuthModal";
import EnrollmentForm from "./EnrollmentForm";
import './TrainerCardList.css';

 const RelatedCoursesCarousel = ({ courseList }) => {
  const navigate = useNavigate();
  const scrollRef = useRef();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [userData, setUserData] = useState([]);

  const handleViewDetails = (course) => {
    navigate(`/course/${course._id}#details`, { state: { course } });
  };

  const scrollByCard = (direction = "next") => {
    const container = scrollRef.current;
    if (!container) return;

    const cardElement = container.children[0];
    if (!cardElement) return;

    const cardWidth = cardElement.getBoundingClientRect().width;
    const gap = 16;
    const scrollAmount = cardWidth + gap;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    let newScrollLeft = direction === "next" ? container.scrollLeft + scrollAmount : container.scrollLeft - scrollAmount;

    if (newScrollLeft > maxScrollLeft) newScrollLeft = maxScrollLeft;
    if (newScrollLeft < 0) newScrollLeft = 0;

    container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
  };

  const handleEnrollmentClick = (course) => {
    if (!user) {
      setIsOpen(true);
      return;
    }
    setUserData([{ name: user.name, email: user.email, phone: user.phone }]);
    setSelectedCourse(course);
    setShowEnrollmentForm(true);
  };

  return (
    <>
      <div className="position-relative d-flex align-items-center justify-content-center px-5"
        style={{ maxWidth: "1200px", minWidth: "80%", margin: "0 auto", minHeight: "550px" }}>

        <Button className="custom-navigation-button position-absolute top-50 translate-middle-y z-2 rounded-circle"
          style={{ left: "1%", height: "40px", width: "40px" }} onClick={() => scrollByCard("prev")}>
          <FaChevronLeft />
        </Button>

        <Card className="d-flex flex-column border-0 w-100 pt-0 h-auto border border-2 p-2">
          <div ref={scrollRef} className="d-flex overflow-x-auto w-100" style={{ gap: "16px", scrollBehavior: "smooth" }}>
            {courseList.map((course) => (
              <div key={course._id} style={{ flex: "0 0 calc(25% - 16px)", maxWidth: "calc(25% - 16px)" }}>
                <Card className="h-100 d-flex flex-column rounded-4 border-0 course-card">
                  <span className="position-absolute top-0 end-0 border border-muted bg-white text-danger px-2 py-1 rounded-bottom-start text-uppercase fs-6 fw-semibold">
                    {course.subscription}
                  </span>
                  {course.image && (
                    <Card.Img
                      variant="top"
                      src={course.image.startsWith("http") ? course.image : `${IMAGE_URL}/${course.image || "default.jpg"}`}
                      alt={course.name}
                      className="w-100 object-fit-cover course-card-img"
                    />
                  )}
                  <Card.Body className="d-flex flex-column p-3">
                    <Card.Title className="fw-bold fs-5 mb-2 text-black">{course.name}</Card.Title>
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
                      <Button size="sm" className="flex-grow-1 custom-border-button" onClick={() => handleViewDetails(course)}>
                        View Program
                      </Button>
                      <Button variant="danger" size="sm" className="flex-grow-1" onClick={() => handleEnrollmentClick(course)}>
                        Enroll Now
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </Card>

        <Button className="custom-navigation-button position-absolute top-50 translate-middle-y z-2 rounded-circle"
          style={{ right: "1%", height: "40px", width: "40px" }} onClick={() => scrollByCard("next")}>
          <FaChevronRight />
        </Button>

      </div>

      {isOpen && <AuthModal isOpen={isOpen} setIsOpen={setIsOpen} />}
      {showEnrollmentForm && <EnrollmentForm course={selectedCourse} userData={userData} onClose={() => setShowEnrollmentForm(false)} />}
    </>
  );
};

export default RelatedCoursesCarousel;
