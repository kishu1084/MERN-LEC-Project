import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Form, Container } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { GetAllRegisteredStudents,
         UpdateRegisteredStudentStatus,
         DeleteRegisteredStudent, 
         DeleteParticularEventForStudent,
         UpdateStudentStatus,
         } from "../../../API/eventStudentAPI";
import { Sidebar } from "./AdminDashboard";
import { notify } from "../../../utills";
import { FaCheckCircle, FaEdit, FaTimesCircle, FaTrash, FaUserAlt } from "react-icons/fa";

const RegisteredStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState({}); // {studentId, eventId, status, paymentStatus, fees}

  // Fetch all students initially
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const data = await GetAllRegisteredStudents();
    if (Array.isArray(data)) {
      setStudents(data);
    } else {
      toast.error(data.message || "Failed to fetch students");
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    const { studentId, eventId, status, paymentStatus, fees } = editing;
    const res = await UpdateRegisteredStudentStatus(studentId, eventId, status, paymentStatus, fees);

    if (res && res.message) {
      toast.success("Event Status Updated!");
      fetchStudents();
      setEditing({});
    } else {
      toast.error(res.message || "Failed to update event status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student registration?")) {
      const res = await DeleteRegisteredStudent(id);
      if (res && res.message) {
        toast.success("Student Deleted!");
        fetchStudents();
      } else {
        toast.error(res.message || "Failed to delete student");
      }
    }
  };

  const handleDeleteEvent = async (studentId, eventId) => {
    if (window.confirm("Are you sure you want to remove this event from the student?")) {
        const res = await DeleteParticularEventForStudent(studentId, eventId);
        if (res.success === false) {
            toast.error(res.message);
        } else {
            toast.success("Event removed from student!");
            fetchStudents();
        }
      }
  };
  
  const handleToggleStatus = async (student) => {
    const newStatus = student.status === 'Active' ? 'Inactive' : 'Active'; // Ensure 'Inactive' is a valid value
    console.log("Toggling status to:", newStatus);
    const res = await UpdateStudentStatus(student.id, { status: newStatus });
  
      if (res.success === false) {
        toast.error(res.message);
      } else {
        toast.success("Student status updated successfully!");
        fetchStudents();  // Refresh the student list
      }
    
  };
  


  const startEditing = (studentId, eventId, currentStatus, currentPaymentStatus, currentFees) => {
    setEditing({
      studentId,
      eventId,
      status: currentStatus,
      paymentStatus: currentPaymentStatus,
      fees: currentFees,
    });
  };

  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <ToastContainer />
      <Container className="py-4 w-100">
      <h2 className="mb-4">Manage Event Registered Students</h2>

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No Registered Students Found.</p>
      ) : (
        <Row xs={1} md={1} lg={1} className="g-0">
          {students.map((student) => (
            <Col key={student._id}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title><FaUserAlt size={30} className="text-info me-3" />{student?.studentId?.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Email: {student?.studentId?.email}</Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted">
                    Status: {student?.status}{" "}{ student.status === 'Active' ? (
                      <FaCheckCircle className="text-success ms-1" />
                    ) : (
                      <FaTimesCircle className="text-danger ms-1" />
                    )}
                  </Card.Subtitle>
                  
                  {student.eventDetails.map((event) => (
                    <div key={event.eventId._id} className="shadow-sm border-end-0 border border-bottom-0 border-top-0 border-3 border-primary-subtle mb-3 p-3 rounded-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          {/* Left-aligned content like course name */}
                        </div>
                        <div>
                          {event.paymentStatus === "paid" ? (
                            <span className="badge bg-success">Fees Paid</span>
                          ) : (
                            <span className="badge bg-warning text-dark">
                              Fees Pending: ₹{event.fees}
                            </span>
                          )}
                        </div>
                      </div>

                      <p><strong>Event:</strong> {event.eventId.title}</p>
                      <p><strong>Starting Date:</strong> {new Date(event.eventId?.startDateTime).toLocaleString()}</p>
                      <p><strong>Trainer:</strong> {event?.eventId.trainerName}</p>
                      <p><strong>Status:</strong> {event.status}</p>
                      <p><strong>Payment:</strong> {event.paymentStatus}</p>
                      <p><strong>Fees:</strong> ₹{event.fees}</p>

                      {editing.studentId === student.studentId._id && editing.eventId === event.eventId._id ? (
                        <>
                          <Form.Group className="mb-2">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                              value={editing.status}
                              onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                            >
                              <option value="registered">Registered</option>
                              <option value="completed">Completed</option>
                              <option value="active">Active</option>
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-2">
                            <Form.Label>Payment Status</Form.Label>
                            <Form.Select
                              value={editing.paymentStatus}
                              onChange={(e) => setEditing({ ...editing, paymentStatus: e.target.value })}
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                            </Form.Select>
                          </Form.Group>

                          <Button variant="success" size="sm" onClick={handleUpdate} className="me-2">
                            Save
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => setEditing({})}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={() => startEditing(student.studentId._id, event.eventId._id, event.status, event.paymentStatus, event.fees)}
                            className="me-2"
                          >
                            <FaEdit />Edit
                          </Button>
                          <Button
                              size="sm"
                              variant="outline-danger"
                              className="me-2"
                              onClick={() => handleDeleteEvent(student.studentId._id, event.eventId._id)}
                          >
                              <FaTrash /> Remove Event
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                  <div className="d-flex flex-wrap justify-content-start gap-2 mt-auto">
                   
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => handleDelete(student._id)}
                    >
                      <FaTrash /> Delete Student
                    </Button>

                    <Button
                      variant="outline-info"
                      onClick={() => handleToggleStatus(student)}
                    >
                      Toggle Status
                    </Button>
                  </div>

                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      </Container>
    </div>
  );
};

export default RegisteredStudents;
