import { useEffect, useState } from "react";
import { Button, Badge, Card, Row, Col, Container, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Sidebar } from "./AdminDashboard";
import { FaTrash, FaSyncAlt, FaGraduationCap, FaTimesCircle } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

import { deleteInquiry, fetchInquiries,updateInquiryStatus, } from "../../../API/cousellingRequestAPI";

const AdminInquiryList = () => {
    const [inquiries, setInquiries] = useState([]);
    const [searchCourse, setSearchCourse] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");


    const loadInquiries = async () => {
        try {
            const data = await fetchInquiries();
            setInquiries(data);
        } catch (error) {
            toast.error("Error fetching inquiries");
        }
    };
    
    // UseEffect to auto-load inquiries on component mount
    useEffect(() => {
        loadInquiries();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
        try {
            await deleteInquiry(id);
            setInquiries(inquiries.filter((inq) => inq._id !== id));
            toast.success("Inquiry deleted");
        } catch (error) {
            toast.error("Error deleting inquiry");
        }
    };
    

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const updated = await updateInquiryStatus(id, newStatus);
            setInquiries(
                inquiries.map((inq) =>
                    inq._id === id ? { ...inq, status: updated.status } : inq
                )
            );
            toast.success("Status updated");
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    const filteredInquiries = inquiries
    .filter((inq) => {
        const lower = searchCourse.toLowerCase();
        return inq.name.toLowerCase().includes(lower) ||
        inq.email.toLowerCase().includes(lower) ||
        inq.phone.includes(lower)
    })
  .filter((inq) => {
    if (filterStatus === "All") return true;
    return inq.status === filterStatus;
  })
  .filter((inq) => {
    if (!startDate && !endDate) return true;
    const appointment = new Date(inq.appointmentDate);
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;
    if (from && appointment < from) return false;
    if (to && appointment > to) return false;
    return true;
  })
  .sort((a, b) => {
    const statusOrder = {
      "Pending": 1,
      "In Progress": 2,
      "Enrolled": 3,
      "Not Interested": 99
    };
    return (statusOrder[a.status] || 100) - (statusOrder[b.status] || 100);
  });

  const exportToCSV = () => {
    let csv = "Name,Email,Phone,Message,Status,Appointment Date,Contact Start Time,Contact End Time\n";

    filteredInquiries.forEach((inq) => {
        const appointmentDate = new Date(inq.appointmentDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const contactStartTime = inq.contactStartTime
            ? new Date(inq.contactStartTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
            : "N/A";
        const contactEndTime = inq.contactEndTime
            ? new Date(inq.contactEndTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
            : "N/A";

        csv += `${inq.name},${inq.email},${inq.phone},${inq.message},${inq.status},${appointmentDate},${contactStartTime},${contactEndTime}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "CounselingInquiries.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

    

    return (
        <div className="d-flex">
            <Sidebar />
            <Container className="py-0 w-100">
                <h2 className="text-center fw-bold mt-5">Counseling Inquiries</h2><hr></hr>
                <Row className="mb-3 w-100 g-2 align-items-center">
                    <Col md={9}>
                        <Form.Control
                        type="text"
                        placeholder="Search by Name or email"
                        value={searchCourse}
                        onChange={(e) => setSearchCourse(e.target.value)}
                        />
                    </Col>
                    <Col md={3}>
                        <Row className="g-2">
                        <Col xs={6}>
                            <Button
                            variant="secondary"
                            className="w-100"
                            onClick={() => {
                                setFilterStatus("All");
                                setSearchCourse("");
                                setStartDate("");
                                setEndDate("");
                            }}
                            >
                            Clear Filters
                            </Button>
                        </Col>
                        <Col xs={6}>
                            <Button
                            variant="success"
                            className="w-100"
                            onClick={exportToCSV}
                            >
                            Export CSV
                            </Button>
                        </Col>
                        </Row>
                    </Col>
                </Row>

                <Row className="mb-3 w-100">
                <Col md={4}>
                    <small>Filter by Status:</small>
                    <Form.Select
                    value={filterStatus}
                    className="shadow-sm"
                    onChange={(e) => setFilterStatus(e.target.value)}
                    >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Enrolled">Enrolled</option>
                    <option value="Not Interested">Not Interested</option>
                    </Form.Select>
                </Col>
                <Col md={4}>
                    <small>Start Date:</small>
                    <Form.Control
                    className="shadow-sm"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    />
                </Col>
                <Col md={4}>
                    <small>End Date:</small>
                    <Form.Control
                    className="shadow-sm"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    />
                </Col>
                </Row>

                {filteredInquiries.length === 0 ? (
                    <p className="text-muted text-center">No inquiries found.</p>
                ) : (
                    filteredInquiries.map((inq) => (
                        <Card key={inq._id} className="mb-3 shadow-sm w-100">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col md={3}><strong>Name:</strong> {inq.name}</Col>
                                    <Col md={3}><strong>Email:</strong> {inq.email}</Col>
                                    <Col md={2}><strong>Phone:</strong> {inq.phone}</Col>
                                    <Col md={4}><strong>Message:</strong> {inq.message}</Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col md={2}><strong>Date:</strong> {new Date(inq.appointmentDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })}
                                    </Col>
                                    <Col md={2}>
                                    <strong>Time:</strong>{" "}
                                    {inq.contactStartTime && inq.contactEndTime ? (
                                        <>
                                        {new Date(inq.contactStartTime).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}{" "}
                                        -{" "}
                                        {new Date(inq.contactEndTime).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                        </>
                                    ) : (
                                        "N/A"
                                    )}
                                    </Col>

                                    <Col md={2}>
                                    <Badge bg={
                                        inq.status === "In Progress" ? "success" :
                                        inq.status === "Pending" ? "warning" :
                                        inq.status === "Enrolled" ? "primary" :
                                        inq.status === "Not Interested" ? "dark" :
                                        "secondary"
                                    }>
                                        {inq.status}
                                    </Badge>
                                    </Col>
                                    <Col md={6} className="d-flex justify-content-end">
                                        <Button
                                            variant="outline-success"
                                            className="me-2"
                                            onClick={() => handleStatusUpdate(inq._id, inq.status === "In Progress" ? "Pending" : "In Progress")}
                                        >
                                            <FaSyncAlt /> Toggle Status
                                        </Button>
                                        <Button variant="outline-danger" className="me-2" onClick={() => handleDelete(inq._id)}>
                                            <FaTrash /> Delete
                                        </Button>
                                        <Button
                                            variant="outline-primary"
                                            className="me-2"
                                            onClick={() => handleStatusUpdate(inq._id, "Enrolled")}
                                            disabled={inq.status === "Enrolled"}
                                        >
                                            <FaGraduationCap className="me-1" /> Mark as Enrolled
                                        </Button>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => handleStatusUpdate(inq._id, "Not Interested")}
                                            disabled={inq.status === "Not Interested"}
                                        >
                                            <FaTimesCircle className="me-1" /> Not Interested
                                        </Button>

                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))
                )}
                <ToastContainer position="top-right" autoClose={3000} closeOnClick pauseOnHover />
            </Container>
        </div>
    );
};

export default AdminInquiryList;
