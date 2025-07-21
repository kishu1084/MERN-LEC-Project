import { useEffect, useState } from "react";
import { Button, Badge, Card, Row, Col, Container, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Sidebar } from "./AdminDashboard";
import { FaCheckCircle, FaTimesCircle, FaTrash, FaFileCsv } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { getAllCourseEnrollments, updateEnrollmentStatus, deleteEnrollment } from "../../../API/courseEnrollmentAPI";
import { GetAllCourses } from "../../../api";
import { notify } from "../../../utills";

const CourseRequirestManagement = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [filterStatus, setFilterStatus] = useState("All"); // All | Pending | Completed
    const [searchCourse, setSearchCourse] = useState(""); // For search bar
    const [startDate, setStartDate] = useState(""); // For start date filter
    const [endDate, setEndDate] = useState(""); // For end date filter
    const [courseList, setCourseList] = useState([]);

    useEffect(() => {
        fetchEnrollments();
        feachAllcourses();
    }, []);

    const feachAllcourses = async () => {
        try {
            const { data } = await GetAllCourses();
            setCourseList(data);
        } catch (err){
            notify('Failed to feach a courses', err);
        }
    }

    const fetchEnrollments = async () => {
        const result = await getAllCourseEnrollments();
        
        if (result.success) {
            setEnrollments(result.data);
        } else {
            toast.error(result.message || "Failed to fetch enrollments");
        }
    };

    const getCourseNameById = (courseId) => {
        const course = courseList.find((course) => course._id === (courseId?._id || courseId));
        return course ? course.name : "Course not found";
    };

    const handleStatusUpdate = async (id, newStatus) => {
        const confirmUpdate = window.confirm(`Are you sure you want to mark as "${newStatus}"?`);
        if (!confirmUpdate) return;

        const result = await updateEnrollmentStatus(id, newStatus);
        if (result.success) {
            toast.success("Status updated");
            setEnrollments((prevEnrollments) =>
                prevEnrollments.map((user) => ({
                    ...user,
                    requests: user.requests.map((r) =>
                        r._id === id ? { ...r, status: newStatus } : r
                    ),
                }))
            );
        } else {
            toast.error(result.message || "Error updating status");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you Sure you want to delete this Enrollment Request?")) {
            try {
                const result = await deleteEnrollment(id);
                if (result.success) {
                    toast.success('Enrollment deleted successfully!');
    
                    setEnrollments(prevEnrollments =>
                        prevEnrollments
                            .map(user => ({
                                ...user,
                                requests: user.requests.filter(r => r._id !== id),
                            }))
                            .filter(user => user.requests.length > 0) // Remove users with no requests left
                    );
    
                    // No need to re-fetch
                } else {
                    toast.error(result.message || 'Failed to delete enrollment');
                }
            } catch (err) {
                toast.error(err.error || 'Failed to delete enrollment');
            }
        }
    };
    

    const statusBadgeVariant = (status) => {
        switch (status) {
            case "Approved":
                return "success";
            case "Rejected":
                return "danger";
            case "Pending":
                return "warning";
            case "Completed":
                return "success";
            default:
                return "secondary";
        }
    };

    const getPriority = (status) => {
        const order = { "Pending": 1, "Approved": 2, "Rejected": 3 };
        return order[status] || 99;
    };

    // Apply filters to the enrollments
    const filteredEnrollments = enrollments.filter((user) => {
        const statusMatch =
            filterStatus === "All" || user.requests.some((r) => r.status === filterStatus);
    
            const courseMatch =
            !searchCourse ||
            user.requests.some((r) => {
                const courseName = getCourseNameById(r.courseId);
                return courseName.toLowerCase().includes(searchCourse.toLowerCase());
            });
    
        const dateMatch =
            (!startDate && !endDate) ||
            user.requests.some((r) => {
                const enrollmentDate = new Date(r.date);
                const startDateMatch = startDate ? enrollmentDate >= new Date(startDate) : true;
                const endDateMatch = endDate ? enrollmentDate <= new Date(endDate) : true;
                return startDateMatch && endDateMatch;
            });
    
        return statusMatch && courseMatch && dateMatch;
    });
    
    

    const sortedEnrollments = [...filteredEnrollments].sort((a, b) => {
        const aPriority = Math.min(...a.requests.map((r) => getPriority(r.status)));
        const bPriority = Math.min(...b.requests.map((r) => getPriority(r.status)));
        return aPriority - bPriority;
    });

    const exportToCSV = () => {
        let csv = "Name,Email,Phone,Course,Status,Count,Requested On\n";
    
        sortedEnrollments.forEach((user) => {
            const groupedRequests = Object.values(
                user.requests.reduce((acc, req) => {
                    const key = `${req.courseId}_${req.status}`;
                    if (!acc[key]) {
                        acc[key] = { ...req, count: 1 };
                    } else {
                        acc[key].count += 1;
                    }
                    return acc;
                }, {})
            );
    
            groupedRequests.forEach((enroll) => {
                const courseName = getCourseNameById(enroll.courseId);
                const date = new Date(enroll.date).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                });
    
                csv += `${user.name},${user.email},${user.phone},${courseName},${enroll.status},${enroll.count},${date}\n`;
            });
        });
    
        // Create a Blob and trigger download
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "CourseEnrollmentRequests.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    

    return (
        <div className="d-flex vh-100">
            <Sidebar />
            <Container className="py-3 w-100">
                <h3 className="text-center fw-bold">Course Enrollment Requests</h3>
               
                <Row className="mb-3 w-100 g-2 align-items-center">
                    <Col md={9}>
                        <Form.Control
                            type="text"
                            placeholder="Search by Course Name"
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
                                <Button variant="success" className="w-100" onClick={exportToCSV}>
                                    <FaFileCsv className="me-1" /> Export CSV
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
                            <option value="All">All Request States</option>
                            <option value="Pending">Pending States</option>
                            <option value="Approved">Completed States</option>
                        </Form.Select>
                    </Col>
                    
                    <Col md={4}>
                    <small>Start Date:</small>
                        <Form.Control
                            className="shadow-sm"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="Start Date"
                        />
                    </Col>
                    <Col md={4}>
                    <small>End Date:</small>
                        <Form.Control
                            type="date"
                            className="shadow-sm"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder="End Date"
                        />
                    </Col>
                    

                </Row>
                {(sortedEnrollments.length === 0 ? (
                    <p className="text-muted text-center">No enrollment requests found.</p>
                ) : (
                    sortedEnrollments.map((user) => (
                        <Card key={user.email} className="mb-4 shadow-sm w-100">
                            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                                <div><strong>{user.name}</strong> | {user.email} | {user.phone}</div>
                                <Badge bg={user.requests.some((r) => r.status === "Pending") ? "warning" : "success"}>
                                    {user.requests.some((r) => r.status === "Pending") ? "Pending" : "Completed"}
                                </Badge>
                            </Card.Header>

                            <Card.Body>
                            {Object.values(
                                user.requests.reduce((acc, req) => {
                                    const key = `${req.courseId}_${req.status}`;
                                    if (!acc[key]) {
                                        acc[key] = { ...req, count: 1 };
                                    } else {
                                        acc[key].count += 1;
                                    }
                                    return acc;
                                }, {})
                            ).sort((a, b) => getPriority(a.status) - getPriority(b.status))
                            .map((enroll) => (
                                <Row key={enroll._id} className="align-items-center border-bottom py-2">
                                    <Col md={4}>
                                        <strong>Course:</strong> {getCourseNameById(enroll.courseId)}{" "}
                                        <Badge bg={statusBadgeVariant(enroll.status)}>{enroll.status}</Badge>{" "}
                                        {enroll.count > 1 && (
                                            <Badge bg="warning" >
                                                {enroll.count} requests
                                            </Badge>
                                        )}<br />
                                        <small className="text-muted">
                                            <strong>Requested on:</strong>{" "}
                                            {new Date(enroll.date).toLocaleString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </small>
                                    </Col>
                                    <Col md={8} className="text-end">
                                        <Button variant="outline-danger" className="me-2" onClick={() => handleDelete(enroll._id)}>
                                            <FaTrash className="me-1" /> Delete
                                        </Button>
                                        <Button
                                            variant="outline-success"
                                            className="me-2"
                                            onClick={() => handleStatusUpdate(enroll._id, "Approved")}
                                            disabled={enroll.status === "Approved" || enroll.status === "Rejected"}
                                        >
                                            <FaCheckCircle className="me-1" /> Approve
                                        </Button>
                                        <Button
                                            variant="outline-secondary"
                                            className="me-2"
                                            onClick={() => handleStatusUpdate(enroll._id, "Rejected")}
                                            disabled={enroll.status === "Rejected" || enroll.status === "Approved"}
                                        >
                                            <FaTimesCircle className="me-1" /> Reject
                                        </Button>
                                    </Col>
                                </Row>
                            ))}

                            </Card.Body>
                        </Card>
                    ))
                ))}
                
                <ToastContainer position="top-right" autoClose={3000} closeOnClick pauseOnHover />
            </Container>
        </div>
    );
};

export default CourseRequirestManagement;
