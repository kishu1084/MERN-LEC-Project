import styles from './AdminDashboard.css';
import {React, useState} from "react";
import { Container, Row, Col, Navbar, Nav, Card, Button, Accordion } from "react-bootstrap";
import { FaTachometerAlt, FaBook, FaUserGraduate, FaSignOutAlt, 
          FaCog, FaUsers, FaChalkboardTeacher, FaCalendarCheck, 
         FaFileInvoice, FaComments,
         FaBullhorn, FaChartBar, FaQuestionCircle, FaHandshake, FaUsersCog } 
         from "react-icons/fa";
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export const Sidebar = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState(null);
  const [StudentactiveKey, setStudentActiveKey] = useState(null);
  const [studentactiveKey, setstudentActiveKey] = useState(null);

  const handleToggle = (key) => {
    setActiveKey(prev => (prev === key ? null : key));
  };

  const handlestudentToggle = (key) => {
    setstudentActiveKey(prev => (prev === key ? null : key));
  };

  const handleStudentToggle = (key) => {
    setStudentActiveKey(prev => (prev === key ? null : key));
  };

  return (
    <div className="sidebar d-flex flex-column p-3 text-white bg-dark vh-100h-auto">
      <h4 className="text-center">Admin Panel</h4>
      <Nav className="flex-column">
        <Nav.Link onClick={() => navigate("/admin-dashboard")} className="text-white">
          <FaTachometerAlt /> Dashboard
        </Nav.Link>
        <Nav.Link onClick={() => navigate("/admin-dashboard/manage-courses")} className="text-white">
          <FaBook /> Course Management
        </Nav.Link>

        <Accordion activeKey={StudentactiveKey} className="custom-accordion" flush>
          <Accordion.Item eventKey="1" className="border-0">
            <Accordion.Header onClick={() => handleStudentToggle("1")} className='custom-dropdown-header'>
              <FaUserGraduate/>
              Student Management
            </Accordion.Header>
            <Accordion.Body>
              <Nav className="flex-column ps-2">
                <Nav.Link onClick={() => navigate("/admin-dashboard/manage-student")} className="text-dark">
                  Course Students
                </Nav.Link>
                <Nav.Link onClick={() => navigate("/admin-dashboard/manage-event-students")} className="text-dark">
                  Event Students
                </Nav.Link>
              </Nav>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Accordion activeKey={studentactiveKey} className="custom-accordion" flush>
          <Accordion.Item eventKey="1" className="border-0">
            <Accordion.Header onClick={() => handlestudentToggle("1")}>
              <FaBullhorn className="me-2" />
              Enrollment Management
            </Accordion.Header>
            <Accordion.Body>
              <Nav className="flex-column ps-2">
                <Nav.Link onClick={() => navigate("/admin-dashboard/manage-inquiry")} className="text-dark">
                  Inquirey Management
                </Nav.Link>
                <Nav.Link onClick={() => navigate("/admin-dashboard/manage-course-requirest")} className="text-dark">
                  Course Requirest Management
                </Nav.Link>
                <Nav.Link onClick={() => navigate("/admin-dashboard/manage-event-inquiry")} className="text-dark">
                  Event Inquirey Management
                </Nav.Link>
              </Nav>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Nav.Link onClick={() => navigate("/admin-dashboard/manage-trainer")} className="text-white">
          <FaUsersCog /> Trainer Management
        </Nav.Link>
        <Nav.Link onClick={() => navigate("/admin-dashboard/manage-quize")} className="text-white">
          <FaFileInvoice /> Quiz & Assessment Management
        </Nav.Link>
        <Nav.Link onClick={() => navigate("/admin-dashboard/manage-associated-companies")} className="text-white">
          <FaHandshake /> Associated Companies Management
        </Nav.Link>
        <Nav.Link onClick={() => navigate("/admin-dashboard/manage-testimonial")} className="text-white">
          <FaComments /> Testimonial Management
        </Nav.Link>
        {/* <Nav.Link onClick={() => navigate("/admin-dashboard")} className="text-white">
          <FaVideo /> Live Webinars & Virtual Classes
        </Nav.Link> */}

        {/* DROPDOWN START */}
        <Accordion activeKey={activeKey} className="custom-accordion" flush>
          <Accordion.Item eventKey="1" className="border-0">
            <Accordion.Header onClick={() => handleToggle("1")}>
              <FaBullhorn className="me-2" />
              Announcements & Events 
            </Accordion.Header>
            <Accordion.Body>
              <Nav className="flex-column ps-2">
                <Nav.Link onClick={() => navigate("/admin-dashboard/manage-news")} className="text-dark">
                  News Management
                </Nav.Link>
                <Nav.Link onClick={() => navigate("/admin-dashboard/manage-events")} className="text-dark">
                  Event Announcements
                </Nav.Link>
              </Nav>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        {/* DROPDOWN END */}

        <Nav.Link onClick={() => navigate("/admin-dashboard/manage-quize-result")} className="text-white">
          <FaChartBar /> Reports & Analytics
        </Nav.Link>
        <Nav.Link onClick={() => navigate("/admin-dashboard/manage-faqs")} className="text-white">
          <FaQuestionCircle /> FAQs Management
        </Nav.Link>
        <Nav.Link onClick={() => navigate("/admin-dashboard")} className="text-white">
          <FaCog /> Settings
        </Nav.Link>
        <Nav.Link
          onClick={() => {
            if (window.confirm("Are sure you want to Log Out ?")) navigate("/");
          }}
          className="text-white"
        >
          <FaSignOutAlt /> LogOut
        </Nav.Link>
      </Nav>
    </div>
  );
};

const DashboardContent = () => {
  return (
    <Container fluid className="p-4">
      <Row>
        <Col md={4}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <FaUsers size={40} className="mb-2" />
              <Card.Title>Total Students</Card.Title>
              <Card.Text>1,200 Enrolled</Card.Text>
              <Button as={Link} to="/admin-dashboard/manage-student" variant="primary">View</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <FaChalkboardTeacher size={40} className="mb-2" />
              <Card.Title>Active Courses</Card.Title>
              <Card.Text>25 Available</Card.Text>
              <Button as={Link} to="/admin-dashboard/manage-courses" variant="success">Manage</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <FaCalendarCheck size={40} className="mb-2" />
              <Card.Title>Upcoming Events</Card.Title>
              <Card.Text>5 Scheduled</Card.Text>
              <Button as={Link} to="/admin-dashboard/manage-events" variant="warning">Check</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default function AdminDashboard() {
  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar bg="light" expand="lg" className="shadow-sm p-3">
          <Navbar.Brand href="#">SSM LEC Admin</Navbar.Brand>
        </Navbar>
        <DashboardContent />
      </div>
    </div>
  );
}
