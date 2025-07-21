import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Badge,
  InputGroup,
} from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { FaPlus, FaEdit, FaTrash, FaThumbtack, FaCalendarAlt,FaTimesCircle, FaSearch, FaSyncAlt } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { Sidebar } from "../AdminDashboard";
import { createEvent, DeleteEventById, GetAllEvents, UpdateEventById } from "../../../../API/eventApi";
import { notify, IMAGE_URL } from "../../../../utills";


const EventAnnouncements = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [termOfSearch, setTermOfSearch] = useState(null);
  const [eventdata, setEventdata] = useState({
    title: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
    location: "",
    status: "Draft",
    pinned: false,
    tags: "",
    eventType: "",
    trainerName: "",
    banner: null,
    fee: "",
    them: "",
  });

  const [eventList, setEventList] = useState([]);
  const [copyEvent, setCopyEvent] = useState([]);


  const handleSearch = () => {
  
    const term = String(searchTerm || "").toLowerCase();
    setTermOfSearch(term);
  
    const result = copyEvent.filter((item) =>
      (item.title || "").toLowerCase().includes(term)
    );
  
    setEventList(result);
    setIsSearching(true);
  };
  

  const feachAllEvents = async () => {
      try {
        const { data } = 
          await GetAllEvents();
          setEventList(data);
          setCopyEvent(data);
      } catch (err) {
        console.error(err);
        notify('Failed to feach events', 'error')
      }
    }
    useEffect(() => {
      feachAllEvents();
    },[]);

  const handleShowModal = (index = null) => {
    if (index !== null) {
      setEditingIndex(index);
    } else {
      setEditingIndex(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {

    if (window.confirm("Are you Sure you want to Close if you Close than you lose the data?")){

      setShowModal(false);
      setEditingIndex(null);
      setEventdata({ title:"",description:"", startDateTime:"",endDateTime:"",location:"",status:"Draft", pinned: false , tags: "",eventType:"",trainerName:"",banner:null, fee:"", them:""});
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventdata({...eventdata,[name]: type === "checkbox" ? checked : value,});
  };

  const handleSave =async (e) => {
    e.preventDefault();

    const eventData= {
      title: eventdata.title,
      description:eventdata.description,
      startDateTime: eventdata.startDateTime,
      endDateTime: eventdata.endDateTime,
      location: eventdata.location,
      status: eventdata.status,
      pinned: eventdata.pinned,
      tags: eventdata.tags,
      eventType: eventdata.eventType,
      trainerName: eventdata.trainerName,
      banner: eventdata.banner,
      fee: eventdata.fee,
      them: eventdata.them,
    }

    const updatedEvents = [...events];
    if (editingIndex !== null) {

      try {
            const updatedEvent = { ...eventdata }; // Keep all course details
            
            const { success, message } = await UpdateEventById(eventList[editingIndex]._id, updatedEvent);
            
            if (success) {
              notify(message, "success");
              
              feachAllEvents(); // Refresh list after update
            } else {
              notify(message, "error");
            }
          } catch (err) {
            console.error(err);
            notify("Failed to update course", "error");
          }
          setEditingIndex(null);
    } else {
      const { success, message } = await createEvent(eventData);
      if(success) {
        notify(message, "success");
      }else {
        notify(message, "error");
      }
    }
    setEvents(updatedEvents);
    feachAllEvents();
    setShowModal(false);
    setEditingIndex(null);
    setEventdata({ title:"",description:"", startDateTime:"",endDateTime:"",location:"",status:"Draft", pinned: false , tags: "",eventType:"",trainerName:"",banner:null, fee: "", them:""});
    
  };

  const handleImageChange = (e) => {
    setEventdata({ ...eventdata, banner: e.target.files[0] }); // Store actual file object
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you Sure you want to delete this Event?")) {
      try {
              const {  success, message } = await DeleteEventById(id);
              if(success){
                notify(message, 'success')
              }else{
                notify(message, 'error')
              }
              feachAllEvents()
          } catch (err) {
              console.error(err);
              notify('Failed to delete a course', 'error')
          }
    }
  };

  const handleEdit = (event) => {
    const index = eventList.findIndex(c => c._id === event._id);
    setEditingIndex(index);
    setEventdata({ ...event});
    setShowModal(true);
  }

  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  };
  
  const handleventStatus = async (eventId) => {
    const { _id, status, name } = eventId;
    const obj = {
      name,
      status: status === "Published" ? "Draft" : "Published"
    };
  
    try {
      const { success, message } = await UpdateEventById(_id, obj);
  
      if (success) {
        notify(message, 'success');
      } else {
        notify(message, 'error');
      }
  
      feachAllEvents();
    } catch (err) {
      console.error(err);
      notify('Failed to update event status', 'error');
    }
  };
  
  

  return (
    <div className="d-flex">
    <Sidebar />
    <Container className="py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="mb-4 fw-bold">Event Announcements Management</h2>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="primary" onClick={() => handleShowModal()}>
          <FaPlus className="me-1" /> Add Event
        </Button>
        </div>
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search Event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <Button variant="outline-secondary" onClick={handleSearch}>
            <FaSearch />
          </Button>
        </InputGroup>

        
        {isSearching && (
          <Container className="search-container d-flex align-items-center justify-content-evenly">
            <div className="d-flex align-items-center">
              <FaSearch className="text-primary me-2" size={20} />
              <h5 className="text-primary fw-bold mb-0">Showing results for:</h5>
              <h4 className="fw-semibold mb-0 ms-2">{termOfSearch}</h4>
              <Button 
              variant="danger" 
              className="back-btn d-flex align-items-center"
              onClick={() => {
                setEventList(copyEvent);
                setSearchTerm(""); 
                setIsSearching(false);
              }}
            >
              <FaTimesCircle className="me-2" /> Back to All Event
            </Button>
            </div>
            
          </Container>
        )}
      

      <Row>
        {eventList.length === 0 ? (
          <p className="text-muted">No events yet.</p>
        ) : (
          eventList.map((event, index) => (
            
            <Col md={6} lg={4} key={index} className="mb-4">
              <Card className="h-100 shadow-sm border-0 rounded-4">
                {/* Event Image / Banner */}
                {event.banner && (
                  <Card.Img
                    variant="top"
                     src={`${IMAGE_URL}/${event.banner}`}
                    alt="Event Banner"
                    className="rounded-top"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                )}

                <Card.Body className="d-flex flex-column justify-content-between">
                  {/* Title and Status */}
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <Card.Title className="h5 fw-semibold mb-0">
                        {event.title}
                      </Card.Title>
                      {event.pinned && (
                        <FaThumbtack title="Pinned" color="gold" className="mt-1" />
                      )}
                    </div>
                    <Badge
                      bg={event.them === "Dark" ? "black" : "warning"}
                      className="px-3 py-1"
                    >
                      {event.them}
                    </Badge>
                    <Badge
                      bg={event.status === "Published" ? "success" : "secondary"}
                      className="px-3 py-1"
                    >
                      {event.status}
                    </Badge>
                  </div>

                  {/* Date & Time */}
                  <div className="small text-muted mb-2">
                    <FaCalendarAlt className="me-1" />
                    {new Date(event.startDateTime).toLocaleString()} —{" "}
                    {new Date(event.endDateTime).toLocaleString()}
                  </div>

                  {/* Location */}
                  <div className="mb-1">
                    <strong>Location:</strong> {event.location || "N/A"}
                  </div>

                  {/* Event Type */}
                  <div className="mb-1">
              
                    <strong>Type:</strong> {event.eventType || "N/A"}
                  </div>

                  
                 
                    <div className="mb-1">
                      <strong>Trainer Name:</strong>{" "}
                      
                        {event.trainerName}
                      
                    </div>
                    <div className="mb-2">
                      <strong>Fee:</strong>{" "}
                      
                        {event.fee}
                      
                    </div>
                  

                  {/* Description */}
                  <Card.Text className="text-muted" style={{ fontSize: "0.95rem" }}>
                    {event.description?.length > 150
                      ? event.description.slice(0, 150) + "..."
                      : event.description}
                  </Card.Text>

                  {/* Tags */}
                  {event.tags && (
                    <div className="mb-3 d-flex flex-wrap gap-1">
                      {event.tags.split(",").map((tag, i) => (
                        <Badge key={i} bg="info" className="text-white">
                          #{tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-end gap-2 mt-auto">

                    <Button variant="outline-success" onClick={() => handleventStatus(event)}>
                    <FaSyncAlt className="me-1"/>
                        Toggle Status
                      </Button>
                      
                    <Button
                      variant="outline-primary"
                      onClick={() => handleEdit(event,event._id)}
                    >
                      <FaEdit className="me-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDelete(event._id)}
                    >
                      <FaTrash className="me-1" />
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

          ))
        )}
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingIndex !== null ? "Edit Event" : "Add Event"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Title*</Form.Label>
              <Form.Control
                name="title"
                value={eventdata.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                value={eventdata.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Start Date & Time*</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="startDateTime"
                    value={formatDateTimeLocal(eventdata.startDateTime)}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
              <Form.Group className="mb-2">
                <Form.Label>End Date & Time*</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="endDateTime"
                  value={formatDateTimeLocal(eventdata.endDateTime)}
                  onChange={handleChange}
                />
              </Form.Group>

              </Col>
            </Row>
            <Form.Group className="mb-2">
              <Form.Label>Location</Form.Label>
              <Form.Control
                name="location"
                value={eventdata.location}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Event Type</Form.Label>
              <Form.Select
                name="eventType"
                value={eventdata.eventType}
                onChange={handleChange}
              >
                <option value="">-- Select Event Type --</option>
                <option value="Webinar">Webinar</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Orientation">Orientation</option>
              </Form.Select>
            </Form.Group>

            

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Trainer Name </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Trainer Name"
                    name="trainerName"
                    value={eventdata.trainerName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
              <Form.Group className="mb-2">
                <Form.Label>Them</Form.Label>
                <Form.Select
                  name="them"
                  value={eventdata.them}
                  onChange={handleChange}
                >
                  <option value={"Dark"}>Dark</option>
                  <option value={"Light"}>Light</option>
                </Form.Select>
              </Form.Group>
              </Col>
            </Row>
              
           

            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={eventdata.status}
                onChange={handleChange}
              >
                <option value={"Published"}>Published</option>
                <option value={"Draft"}>Draft</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Tags (comma-separated)</Form.Label>
              <Form.Control
                name="tags"
                value={eventdata.tags}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Check
              className="mb-2"
              type="checkbox"
              label="Pin this event"
              name="pinned"
              checked={eventdata.pinned}
              onChange={handleChange}
            />
            <Row>
              <Col>
              <Form.Group controlId="formBanner" className="mb-3">
                <Form.Label>Event Banner Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2">
                <Form.Label>Fee*</Form.Label>
                <Form.Control
                  type="text"
                  name="fee"
                  value={eventdata.fee}
                  onChange={handleChange}
                />
              </Form.Group>
              </Col>
            </Row>
            

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editingIndex !== null ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </div>
  );
};

export default EventAnnouncements;
