import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Card, InputGroup, Badge } from "react-bootstrap";
import { GetAllEvents } from "../../../API/eventApi";
import { notify } from "../../../utills";
import { SendEventInquiry } from "../../../API/eventInquiryApi";
import { useAuth } from "../../../context/AuthContext";
import AuthModal from "../../pages/AuthModal";
import { ToastContainer } from "react-toastify";
import './UpcomingEvent.css';
import { Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import IMG from './submited.png';
import AIMG from './AlredySubmited.png';
import { API_URL } from "../../../utills";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const UpcomingEvent = () => {
    const [eventList, setEventList] = useState([]);
    const [formData, setFormData] = useState({});
    const { user } = useAuth(); // Auth context to get user data
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isLoggedIn = !!user;
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessage, setResultMessage] = useState("");
    const [resultType, setResultType] = useState("success"); // success or warning


    // Effect to set form data when user logs in or clears when logged out
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
            });
        } else {
            // Reset form data when the user logs out
            setFormData({
                name: "",
                email: "",
                phone: "",
            });
        }
        
    }, [user]); // Re-run when `user` changes

    const handleSubmit = async (e, event) => {
      e.preventDefault();
  
      if (!user) {
          setIsOpen(true); // Trigger login modal
          return;
      }
  
      const inquiryData = formData[event._id] || {};
  
      // Validate required fields
      if (!inquiryData.name || !inquiryData.email || !inquiryData.phone) {
          notify("You already submited the inquirey.", "warning");
          return;
      }
  
      try {
          // Attempt to send inquiry
          await SendEventInquiry({
              ...inquiryData,
              eventId: event._id,
              eventTitle: event.title,
          });
  
          notify("Inquiry submitted successfully!", "success");
          setResultMessage("Inquiry Submitted Successfully!");
          setResultType("success");
          setShowResultModal(true);
  
          // Clear the form for this event
          setFormData((prev) => ({
              ...prev,
              [event._id]: { name: "", email: "", phone: "" },
          }));
      } catch (error) {
        console.error("handleSubmit error:", error);
    
        const status = error?.status;
        const message = error?.message || "Something went wrong.";
    
        if (status === 409) {
            console.log("Warning");
            setResultMessage("You have already submitted an inquiry for this event.");
            setResultType("warning");
            setShowResultModal(true);
            setFormData((prev) => ({
                ...prev,
                [event._id]: { name: "", email: "", phone: "" },
            }));
        } else {
            notify(message, "error");
        }
    }
    
      
  };
  

  const fetchAllEvents = async () => {
    try {
        const { data } = await GetAllEvents();

        // Get current date-time
        const now = new Date();

        // Filter only published & upcoming events
        const upcomingEvents = data.filter((event) => {
            const eventDate = new Date(event.startDateTime); // or event.date if different
            return event.status === "Published" && eventDate >= now;
        });

        // Sort the upcoming events by the start date/time (earliest first)
        upcomingEvents.sort((a, b) => {
            const dateA = new Date(a.startDateTime);
            const dateB = new Date(b.startDateTime);
            return dateA - dateB;  // Sort in ascending order (earliest first)
        });

        setEventList(upcomingEvents);

        // Initialize form data for only upcoming events
        const initialFormData = {};
        upcomingEvents.forEach((event) => {
            initialFormData[event._id] = {
                name: user?.name || "",
                email: user?.email || "",
                phone: user?.phone || "",
            };
        });
        setFormData(initialFormData);
      } catch (err) {
          console.error(err);
          notify("Failed to fetch events", "error");
      }
  };

  

    useEffect(() => {
        fetchAllEvents();
    }, []);

    const handleNext = () => {
        if (currentIndex < eventList.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    useEffect(() => {
      if (user && eventList.length > 0) {
          // Set formData for each event ID
          const initialFormData = {};
          eventList.forEach((event) => {
              initialFormData[event._id] = {
                  name: user.name || "",
                  email: user.email || "",
                  phone: user.phone || "",
              };
          });
          setFormData(initialFormData);
      } else {
          // Reset form data for all events
          const resetFormData = {};
          eventList.forEach((event) => {
              resetFormData[event._id] = {
                  name: "",
                  email: "",
                  phone: "",
              };
          });
          setFormData(resetFormData);
      }
  }, [user, eventList]); // depend on both
  

    return (
        <div className="bg-light w-100"  style={{ padding: "5% 10%" }}>
            {eventList.length === 0 ? (
                <p className="text-muted">No events yet.</p>
            ) : (
                <div className="event-slider">
                  {eventList.length > 1 && (
                        <div className="event-navigation me-4">
                            <Button variant="outline-danger"
                                    className="rounded-circle" 
                                    style={{ width: '50px', height: '50px', padding: 0 }} 
                                    onClick={handlePrev} disabled={currentIndex === 0}>
                                <FaChevronLeft/>
                            </Button>
                            
                        </div>
                    )}
                    <Row className="event-slide d-flex align-items-stretch" key={eventList[currentIndex]._id}>
                      <Col md={7} className="d-flex flex-column">
                            <p className="fw-bold text-black fs-5 mb-0">
                            Investment : ₹ {eventList[currentIndex].fee} Only
                            </p>

                          <p className="fw-bold text-danger fs-3 mt-0">MasterMode Modules by SSM LEC </p>
                          <div>
                          <p>{eventList[currentIndex].title}</p>
                          </div>
                          
                          <div>
                              <Badge bg="danger" className="px-3 py-2 fs-6 me-3">
                                  Start from
                              </Badge>
                              <span className="fs-5 text-black">
                                <strong>
                                    {(() => {
                                        const eventStartDate = new Date(eventList[currentIndex].startDateTime);
                                        const currentDate = new Date();

                                        // Calculate the difference in days
                                        const timeDifference = eventStartDate - currentDate;
                                        const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert ms to days

                                        // If the event is within 7 days, show days remaining
                                        if (daysRemaining > 0 && daysRemaining <= 7) {
                                            return `${eventStartDate.toLocaleDateString("en-GB", {
                                                weekday: "long", // Day of the week (e.g., Monday)
                                                year: "numeric", // Full year (e.g., 2025)
                                                month: "long", // Full month name (e.g., April)
                                                day: "numeric", // Day of the month (e.g., 25)
                                            })} - ${daysRemaining} days remaining !`;
                                        } else {
                                            // Show only the start date if more than 7 days away or past
                                            return eventStartDate.toLocaleDateString("en-GB", {
                                                weekday: "long", // Day of the week (e.g., Monday)
                                                year: "numeric", // Full year (e.g., 2025)
                                                month: "long", // Full month name (e.g., April)
                                                day: "numeric", // Day of the month (e.g., 25)
                                            });
                                        }
                                    })()}
                                </strong>
                            </span>

                          </div>

                          
                          <p>{eventList[currentIndex].description}</p>
                          <p>
                              Trainer: <span className="text-muted">
                                  <strong>{eventList[currentIndex].trainerName}</strong>
                              </span>
                          </p>
                          {eventList[currentIndex].eventType !== "Webinar" && (
                              <p>
                                  Location: <span className="text-muted">
                                      <strong>{eventList[currentIndex].location}</strong>
                                  </span>
                              </p>
                          )}
                          {eventList[currentIndex].eventType === "Webinar" && <p>Mode: "Online"</p>}
                          {eventList[currentIndex].tags && (
                              <div className="mb-3 d-flex flex-wrap gap-1">
                                  {eventList[currentIndex].tags.split(",").map((tag, i) => (
                                      <Badge key={i} bg="black" className="px-3 py-2 fs-6 me-3 text-white">
                                          #{tag.trim()}
                                      </Badge>
                                  ))}
                              </div>
                          )}
                      </Col>

                      <Col md={5} className="d-flex flex-column">
                          <Card className="shadow flex-grow-1">
                              <Card.ImgOverlay
                                  className="p-0"
                                  style={{
                                      backgroundImage: `url(${API_URL.replace('/api', '')}/${eventList[currentIndex].banner.replace('\\', '/')})`,
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                      backgroundRepeat: "no-repeat",
                                      height: "100%",
                                      backgroundColor: "#f0f0f0", // Fallback color
                                  }}
                              />
                              <Card.Body className=" p-4" style={{ opacity: 0.8 }}>
                                  {eventList[currentIndex].them === "Light"
                                    ?(<h4 className="fw-bold mb-3">Register for {eventList[currentIndex].title}</h4>):
                                    (<h4 className="fw-bold mb-3 text-white">Register for {eventList[currentIndex].title}</h4>)}
                                  <Form onSubmit={(e) => handleSubmit(e, eventList[currentIndex])}>
                                  <Form.Control
                                    className="mb-3"
                                    name="name"
                                    placeholder="Name"
                                    onChange={()=>{}}
                                    value={formData[eventList[currentIndex]._id]?.name || ""}
                                    readOnly={!user} // only readonly if user is not logged in
                                    onFocus={(e) => {
                                      if (!isLoggedIn) {
                                        e.target.blur(); // remove focus
                                        setIsOpen(true); // or navigate("/login");
                                      }
                                    }}
                                  />
                                  <Form.Control
                                    className="mb-3"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData[eventList[currentIndex]._id]?.email || ""}
                                    readOnly={!user}
                                    onChange={()=>{}}
                                    onFocus={(e) => {
                                      if (!isLoggedIn) {
                                        e.target.blur(); // remove focus
                                        setIsOpen(true); // or navigate("/login");
                                      }
                                    }}
                                  />
                                  <InputGroup className="mb-3">
                                    <InputGroup.Text>🇮🇳</InputGroup.Text>
                                    <Form.Control
                                      name="phone"
                                      onChange={()=>{}}
                                      placeholder="Contact Number"
                                      value={formData[eventList[currentIndex]._id]?.phone || ""}
                                      readOnly={!user}
                                      onFocus={(e) => {
                                        if (!isLoggedIn) {
                                          e.target.blur(); // remove focus
                                          setIsOpen(true); // or navigate("/login");
                                        }
                                      }}
                                  />
                                  </InputGroup>

                                      <Button variant="danger" className="w-100" type="submit">
                                          Send Inquiry
                                      </Button>
                                      </Form>
                              </Card.Body>
                          </Card>
                          {isOpen && <AuthModal isOpen={isOpen} setIsOpen={setIsOpen} />}
                                  
                      </Col>
                  </Row>


                    {/* Navigation buttons */}
                    {eventList.length > 1 && (
                
                    <div className="event-navigation mx-4">
                      <Button
                          variant="outline-danger"
                          className="rounded-circle" 
                          style={{ width: '50px', height: '50px', padding: 0 }} 
                          onClick={handleNext}
                          disabled={currentIndex === eventList.length-1}
                      >
                          <FaChevronRight/>
                      </Button>
                    </div>
                
            )}
                </div>
            )}
            <ToastContainer />
            <Modal  
                show={showResultModal}
                onHide={() => setShowResultModal(false)}
                centered
                backdrop="static"
                size="md"
                className="p-0"
            >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <Modal.Body className="text-center p-4">
                <img
                    src={resultType === "success" ? IMG : AIMG}
                    alt="Result Illustration"
                    style={{
                    width: "110px",
                    height: "110px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    marginBottom: "1.5rem",
                    border: "4px solid #e0e0e0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                />

                <h4
                    className={`fw-bold mb-3 ${
                    resultType === "success" ? "text-success" : "text-warning"
                    }`}
                >
                    {resultType === "success"
                    ? "Thank You for Reaching Out!"
                    : "Your Inquiry Has Been Submitted"}
                </h4>

                {/* Updated message for clarity */}
                <p
                    className="text-muted"
                    style={{
                    fontSize: "1rem",
                    lineHeight: "1.5",
                    marginBottom: "1.5rem",
                    }}
                >
                    {resultMessage ||
                        (resultType === "success"
                            ? "We have successfully received your request. Our team will reach out to you soon."
                            : "Thank you for your inquiry! Your request has been successfully submitted, and our team will review it.")
                    }
                </p>

                {/* Warning section with more info */}
                {resultType === "warning" && (
                    <>
                    <div
                        className="text-warning mb-3"
                        style={{
                        fontSize: "0.95rem",
                        fontWeight: "500",
                        borderRadius:"12px",
                        borderLeft: "5px solid #ffcc00",
                        paddingLeft: "1rem",
                        textAlign:"start",
                        paddingTop: "0.5rem",
                        paddingBottom: "0.5rem",
                        backgroundColor: "#fff8e1",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                    >
                        <p>
                        Don't worry! We’ve successfully received your inquiry, and it’s under review. You’ll hear from us within <strong>48 hours</strong>.
                        </p>
                        <p>
                        If you have any urgent concerns or additional questions, feel free to contact us at any time. We're here to assist you!
                        </p>
                    </div>
                    </>
                )}

                {resultType === "success" && (
                <>
                    <div
                    className="text-success mb-3"
                    style={{
                        fontSize: "0.95rem",
                        textAlign:"start",
                        borderRadius:"12px",
                        fontWeight: "500",
                        borderLeft: "5px solid #28a745", // Green color for success
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        paddingTop: "0.5rem",
                        paddingBottom: "0.5rem",
                        backgroundColor: "#e8f5e9", // Light green background for success
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                    >
                    <p>
                        Thank you for submitting your inquiry! We have successfully received your request, and it is now under review.
                    </p>
                    <p>
                        Our team will contact you within <strong>48 hours</strong> with further details. In the meantime, feel free to reach out if you have any urgent questions or additional information.
                    </p>
                    </div>
                </>
                )}


                <Button
                    variant={resultType === "success" ? "success" : "warning"}
                    onClick={() => setShowResultModal(false)}
                    className="px-4 py-2 fw-semibold shadow-sm"
                >
                    Got It
                </Button>
                </Modal.Body>
            </motion.div>
            </Modal>




        </div>
    );
};

export default UpcomingEvent;
