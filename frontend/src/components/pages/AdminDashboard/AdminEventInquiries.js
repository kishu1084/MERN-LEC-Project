import React, { useEffect, useState } from "react";
import {
  GetAllEventInquiries,
  DeleteEventInquiry,
  UpdateEventInquiry,
} from "../../../API/eventInquiryApi";
import {
  Button,
  Table,
  Form,
  Row,
  Col,
  Modal,
  Badge,
  Container,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { Sidebar } from "./AdminDashboard";

const AdminEventInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [editingInquiry, setEditingInquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [filters, setFilters] = useState({
    name: "",
    eventTitle: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, inquiries]);

  const fetchInquiries = async () => {
    try {
      const data = await GetAllEventInquiries();
      setInquiries(data);
    } catch (error) {
      toast.error("Error fetching inquiries");
    }
  };

  const applyFilters = () => {
    const { name, status, eventTitle, startDate, endDate } = filters;
    const filtered = inquiries.filter((inquiry) => {
      const createdAt = moment(inquiry.createdAt);
      return (
        inquiry.name.toLowerCase().includes(name.toLowerCase()) &&
        (status ? inquiry.status === status : true) &&
        (eventTitle
          ? inquiry.eventTitle.toLowerCase().includes(eventTitle.toLowerCase())
          : true) &&
        (startDate ? createdAt.isSameOrAfter(moment(startDate)) : true) &&
        (endDate ? createdAt.isSameOrBefore(moment(endDate)) : true)
      );
    });
    setFilteredInquiries(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await DeleteEventInquiry(id);
        toast.success("Inquiry deleted");
        fetchInquiries();
      } catch (error) {
        toast.error("Error deleting inquiry");
      }
    }
  };

  const handleEditClick = (inquiry) => {
    setEditingInquiry(inquiry);
    setUpdatedData(inquiry);
    setShowModal(true);
  };

  const handleUpdateChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async () => {
    try {
      await UpdateEventInquiry(editingInquiry._id, updatedData);
      toast.success("Inquiry updated");
      setShowModal(false);
      fetchInquiries();
    } catch (error) {
      toast.error("Error updating inquiry");
    }
  };

  const handleToggleStatus = async (inquiry, status) => {
    if (window.confirm(`Are you Sure you want to make this Event Request ${status} ?`)) {
        
        try {
        await UpdateEventInquiry(inquiry._id, { ...inquiry, status });
        toast.success(`Marked as ${status}`);
        fetchInquiries();
        } catch (error) {
        toast.error("Error updating status");
        }
    }
  };

  const renderStatusBadge = (status) => {
    const variant =
      status === "Pending"
        ? "warning"
        : status === "Registered"
        ? "success"
        : status === "Contacted"
        ? "info"
        : "secondary";
    return <Badge bg={variant}>{status}</Badge>;
  };

  const resetFilters = () => {
    setFilters({
      name: "",
      eventTitle: "",
      status: "",
      startDate: "",
      endDate: "",
    });
  };

  const exportToCSV = () => {
    let csv = "Name,Email,Phone,Event Title,Status,Submitted On\n";
  
    filteredInquiries.forEach((inquiry) => {
      const date = moment(inquiry.createdAt).format("DD MMM YYYY, hh:mm A");
  
      csv += `${inquiry.name},${inquiry.email},${inquiry.phone},${inquiry.eventTitle},${inquiry.status},${date}\n`;
    });
  
    // Create a Blob and trigger download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "EventInquiries.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  

  return (
    <div className="d-flex">
            <Sidebar/>
            <Container className="mt-4 py-3 w-100 px-0">
            <h3 className="mb-3">Event Inquiries Management</h3>

            {/* Search */}

            <Row className="mb-3 w-100 g-1 align-items-center">
                <Col md={9}>
                    <Form.Control
                        placeholder="Search by name"
                        value={filters.name}
                        onChange={(e) =>
                        setFilters((prev) => ({ ...prev, name: e.target.value }))
                        }
                    />
                </Col>
                <Col md={3}>
                    <Row className="g-2">
                        <Col xs={6}>
                            <Button
                                variant="secondary"
                                className="w-100"
                                onClick={resetFilters}
                            >
                                Clear Filters
                            </Button>
                        </Col>
                        <Col xs={6}>
                            <Button variant="success" className="w-100" onClick={exportToCSV}>
                                    Export CSV
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Filters */}
            <Row className="mb-3 w-100 p-0">
                <Col md={3}>
                    <Form.Select
                        value={filters.eventTitle}
                        onChange={(e) =>
                            setFilters((prev) => ({ ...prev, eventTitle: e.target.value }))
                        }
                        >
                        <option value="">All Events</option>
                        {[...new Set(inquiries.map((inq) => inq.eventTitle))].map((eventTitle) => (
                            <option key={eventTitle} value={eventTitle}>
                            {eventTitle}
                            </option>
                        ))}
                    </Form.Select>

                </Col>
                <Col md={3}>
                <Form.Select
                    value={filters.status}
                    onChange={(e) =>
                    setFilters((prev) => ({ ...prev, status: e.target.value }))
                    }
                >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Registered">Registered</option>
                    <option value="Not-Interested">Not Interested</option>
                </Form.Select>
                </Col>
                <Col md={3}>
                <Form.Control
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                    setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                />
                </Col>
                <Col md={3}>
                <Form.Control
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                    setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                />
                </Col>
            </Row>

            {/* Table */}
            <Table striped bordered hover responsive className="w-100">
                <thead className="table-dark">
                <tr className="w-100">
                    <th>#</th>
                    <th>Event</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredInquiries.map((inquiry, index) => {
                    const isRegistered = inquiry.status === "Registered";

                    return (
                    <tr key={inquiry._id} className="w-100">
                        <td>{index + 1}</td>
                        <td>{inquiry.eventTitle}</td>
                        <td>{inquiry.name}</td>
                        <td>{inquiry.email}</td>
                        <td>{inquiry.phone}</td>
                        <td>{renderStatusBadge(inquiry.status)}</td>
                        <td>
                        {moment(inquiry.createdAt).format("DD MMM YYYY, hh:mm A")}
                        </td>
                        <td>
                        <Button
                            variant="warning"
                            size="sm"
                            className="me-1"
                            onClick={() => handleEditClick(inquiry)}
                            disabled={isRegistered}
                        >
                            <FaEdit /> Edit
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            className="me-1"
                            onClick={() => handleDelete(inquiry._id)}
                        >
                            <FaTrash /> Delete
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            className="me-1"
                            onClick={() => handleToggleStatus(inquiry, "Registered")}
                            disabled={isRegistered}
                        >
                            Registered
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                            handleToggleStatus(inquiry, "Not-Interested")
                            }
                            disabled={isRegistered}
                        >
                            Not Interested
                        </Button>
                        </td>
                    </tr>
                    );
                })}
                </tbody>
            </Table>

            {/* Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                <Modal.Title>Edit Inquiry</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Row>
                    <Col md={6}>
                        <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            name="name"
                            value={updatedData.name || ""}
                            onChange={handleUpdateChange}
                        />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            name="email"
                            value={updatedData.email || ""}
                            onChange={handleUpdateChange}
                        />
                        </Form.Group>
                    </Col>
                    </Row>
                    <Row className="mt-2">
                    <Col md={6}>
                        <Form.Group controlId="phone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            name="phone"
                            value={updatedData.phone || ""}
                            onChange={handleUpdateChange}
                        />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="eventTitle">
                        <Form.Label>Event</Form.Label>
                        <Form.Control
                            name="eventTitle"
                            value={updatedData.eventTitle || ""}
                            onChange={handleUpdateChange}
                        />
                        </Form.Group>
                    </Col>
                    </Row>
                    <Row className="mt-2">
                    <Col md={12}>
                        <Form.Group controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={updatedData.status || ""}
                            onChange={handleUpdateChange}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Registered">Registered</option>
                            <option value="Not-Interested">Not Interested</option>
                        </Form.Select>
                        </Form.Group>
                    </Col>
                    </Row>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleUpdateSubmit}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="top-right" autoClose={3000} closeOnClick pauseOnHover />
            </Container>
    </div>
  );
};

export default AdminEventInquiries;
