import React, { useEffect, useState } from "react";
import { Container, Form, Button, Card, Row, Col, InputGroup } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle, FaUserAlt, FaFileCsv } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Sidebar } from "./AdminDashboard";
import { ToastContainer } from "react-toastify";
import { notify } from "../../../utills";
import { GetAllEnrolledStudent, updateEnrolledStudent } from "../../../API/enrolledStudentApi";

const ManagementStudents = () => {
  const [studentList, setStudentList] = useState([]);
  const [editState, setEditState] = useState({
    studentId: null,
    courseIndex: null,
  });
  const [editValues, setEditValues] = useState({
    customFees: "",
    customDuration: "",
    newInstallmentAmount: "",
  });
  const [studentStatusFilter, setStudentStatusFilter] = useState("All");
  const [courseStatusFilter, setCourseStatusFilter] = useState("All");
  const [feeStatus, setFeeStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");


  const feachALLStudents = async () => {
    try {
      const { data } = await GetAllEnrolledStudent();
      const sanitizedData = data.map((student) => ({
        ...student,
        enrolledCourses: Array.isArray(student.enrolledCourses) ? student.enrolledCourses : [],
      }));
      setStudentList(sanitizedData);
    } catch (err) {
      console.error(err);
      notify("Failed to fetch students", "error");
    }
  };

  const handleToggleStatus = async (student) => {
    const newStatus = student.status === "Active" ? "InActive" : "Active";
    const result = await updateEnrolledStudent(student._id, { status: newStatus });

    if (result.success) {
      notify("Status updated!", "success");
      feachALLStudents();
    } else {
      notify("Failed to update status", "error");
    }
  };

  const handleEditClick = (studentId, courseObj) => {
    setEditState({ studentId, courseIndex: courseObj.index });
    setEditValues({
      customFees: courseObj.customFees || "",
      customDuration: courseObj.customDuration || "",
      newInstallmentAmount: "",
    });
  };

  const handleSave = async (student) => {
    const updatedCourses = [...student.enrolledCourses];
    const courseToUpdate = updatedCourses[editState.courseIndex];
  
    // Add new installment if value provided
    if (editValues.newInstallmentAmount) {
      courseToUpdate.installments = courseToUpdate.installments || [];
      courseToUpdate.installments.push({
        amount: Number(editValues.newInstallmentAmount),
        date: new Date(),
      });
    }
  
    // Update fees and duration
    courseToUpdate.customFees = editValues.customFees;
    courseToUpdate.customDuration = editValues.customDuration;
  
    const result = await updateEnrolledStudent(student._id, {
      enrolledCourses: updatedCourses,
    });
  
    if (result.success) {
      notify("Updated successfully", "success");
      setEditState({ studentId: null, courseIndex: null });
      feachALLStudents();
    } else {
      notify("Update failed", "error");
    }
  };
  

  const handleToggleCourseStatus = async (studentId, courseIndex) => {
    const student = studentList.find((s) => s._id === studentId);
    if (!student) return;
  
    const updatedCourses = [...student.enrolledCourses];
    const currentStatus = updatedCourses[courseIndex].status;
    updatedCourses[courseIndex].status = currentStatus === "Active" ? "InActive" : "Active";
  
    const result = await updateEnrolledStudent(studentId, {
      enrolledCourses: updatedCourses,
    });
  
    if (result.success) {
      notify("Course status updated!", "success");
      feachALLStudents();
    } else {
      notify("Failed to update course status", "error");
    }
  };

  const handleCourseCompleted = async (studentId, courseIndex) => {
    const student = studentList.find((s) => s._id === studentId);
    if (!student) return;
  
    const course = student.enrolledCourses[courseIndex];
  
    // Check if course fees are fully paid
    const totalInstallmentsPaid = course.installments?.reduce((sum, inst) => sum + Number(inst.amount), 0);
    const isFullyPaid = totalInstallmentsPaid >= course.customFees;
  
    // If the course is not fully paid, show a toast message and exit
    if (!isFullyPaid) {
      notify("Please complete the payment before marking the course as completed.", "warning");
      return;
    }
  
    // Confirm before proceeding
    const confirmed = window.confirm("Are you sure you want to mark this course as completed?");
    if (!confirmed) return;
  
    const updatedCourses = [...student.enrolledCourses];
    updatedCourses[courseIndex].status = "Completed";
  
    const result = await updateEnrolledStudent(studentId, {
      enrolledCourses: updatedCourses,
    });
  
    if (result.success) {
      notify("Course marked as completed!", "success");
      feachALLStudents(); // Refresh student list
    } else {
      notify("Failed to update course status", "error");
    }
  };
   
  const handleFeeStatusChange = (e) => {
    setFeeStatus(e.target.value);
  };

  const clearFilters = () => {
    setStudentStatusFilter("All");
    setCourseStatusFilter("All");
    setFeeStatus("");
    setSearchQuery("");
  };
  
  
  const exportToCSV = () => {
    let csv = "Student Name,Email,Phone,Student Status,Course Name,Course Status,Fees,Total Paid,Remaining Fees,Custom Duration,Installments\n";
  
    // Apply all filters just like in render
    const filteredStudents = studentList.filter((student) => {
      if (studentStatusFilter !== "All" && student.status !== studentStatusFilter) return false;
  
      if (courseStatusFilter !== "All") {
        const hasMatchingCourse = student.enrolledCourses.some(
          (course) => course.status === courseStatusFilter
        );
        if (!hasMatchingCourse) return false;
      }
  
      if (feeStatus) {
        const matchesFeeStatus = student.enrolledCourses.some((course) => {
          const paid = course.installments?.reduce((sum, inst) => sum + Number(inst.amount), 0) || 0;
          const fees = Number(course.customFees) || 0;
          if (feeStatus === "paid") return paid >= fees;
          if (feeStatus === "remaining") return paid < fees;
          return true;
        });
        if (!matchesFeeStatus) return false;
      }
  
      const studentNameMatch = student.name?.toLowerCase().includes(searchQuery);
      const courseNameMatch = student.enrolledCourses?.some((course) =>
        course?.courseId?.name?.toLowerCase().includes(searchQuery)
      );
  
      return studentNameMatch || courseNameMatch;
    });
  
    filteredStudents.forEach((student) => {
      student.enrolledCourses.forEach((course) => {
        // Skip course rows that don't match courseStatus or feeStatus filter
        if (
          (courseStatusFilter !== "All" && course.status !== courseStatusFilter) ||
          (feeStatus === "paid" &&
            (course.installments?.reduce((sum, inst) => sum + Number(inst.amount), 0) || 0) <
              (Number(course.customFees) || 0)) ||
          (feeStatus === "remaining" &&
            (course.installments?.reduce((sum, inst) => sum + Number(inst.amount), 0) || 0) >=
              (Number(course.customFees) || 0))
        ) {
          return;
        }
  
        const courseName = course.courseId?.name || "N/A";
        const totalPaid = course.installments?.reduce((sum, inst) => sum + Number(inst.amount), 0) || 0;
        const totalFees = Number(course.customFees) || 0;
        const remainingFees = totalFees - totalPaid;
        const installmentsStr = course.installments
          ?.map((inst) => `${inst.amount} on ${new Date(inst.date).toLocaleDateString("en-IN")}`)
          .join(" | ") || "N/A";
  
        csv += `${student.name},${student.email},${student.phone},${student.status},${courseName},${course.status},${totalFees},${totalPaid},${remainingFees},${course.customDuration || "N/A"},${installmentsStr}\n`;
      });
    });
  
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "FilteredEnrolledStudentsReport.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  

  useEffect(() => {
    feachALLStudents();
  }, []);

  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <Container className="py-4 w-100">
        <h3 className="mb-4 fw-bold">Student Management</h3>
        <Row className="mb-3 w-100 g-2 align-items-center">
          <Col md={9}>
            <InputGroup>
              <Form.Control 
                type="text" 
                placeholder="Search by student or course name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}/>
            </InputGroup>
          </Col>

          <Col md={3}>
            <Row className="g-2">
                <Col xs={6}>
                  <Button variant="secondary" className="w-100" onClick={clearFilters}>
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
        

        <Row className="mb-4 w-100">
          <Col md={4}>
            <Form.Group controlId="studentStatusFilter">
            
              <Form.Select
                value={studentStatusFilter}
                onChange={(e) => setStudentStatusFilter(e.target.value)}
              >
                <option value="All">All Student</option>
                <option value="Active">Active Student</option>
                <option value="InActive">InActive Student</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="courseStatusFilter">
            
              <Form.Select
                value={courseStatusFilter}
                onChange={(e) => setCourseStatusFilter(e.target.value)}
              >
                <option value="All">All Course</option>
                <option value="Active">Active Course</option>
                <option value="InActive">InActive Course</option>
                <option value="Completed">Completed Course</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="feeStatusFilter" className="mb-3">
          
            <Form.Select value={feeStatus} onChange={handleFeeStatusChange}>
              <option value="">All Course Fees</option>
              <option value="paid">Paid Fees Courses</option>
              <option value="remaining">Remaining Fees Courses</option>
            </Form.Select>
          </Form.Group>
        </Col>

        </Row>


        <Row className="g-4 w-100">
          {studentList
          .filter((student) => {
            // Apply status filters
            if (studentStatusFilter !== "All" && student.status !== studentStatusFilter) return false;
          
            if (courseStatusFilter !== "All") {
              const hasMatchingCourse = student.enrolledCourses.some(
                (course) => course.status === courseStatusFilter
              );
              if (!hasMatchingCourse) return false;
            }
          
            if (feeStatus) {
              const matchesFeeStatus = student.enrolledCourses.some((course) => {
                const paid = course.installments?.reduce((sum, inst) => sum + Number(inst.amount), 0) || 0;
                const fees = Number(course.customFees) || 0;
          
                if (feeStatus === "paid") return paid >= fees;
                if (feeStatus === "remaining") return paid < fees;
                return true;
              });
              if (!matchesFeeStatus) return false;
            }
          
            // 🔍 Search filtering
            const studentNameMatch = student.name?.toLowerCase().includes(searchQuery);
            const courseNameMatch = student.enrolledCourses?.some((course) =>
              course?.courseId?.name?.toLowerCase().includes(searchQuery)
            );
          
            return studentNameMatch || courseNameMatch;
          })
          

          .map((student, index) => (
            <Col md={4} key={index}>
              <Card className="h-100 d-flex flex-column shadow-sm">
                <Card.Body className="d-flex flex-column">
                
                  <Card.Title><FaUserAlt size={30} className="text-info me-3" /><strong>{student.name}</strong></Card.Title>

                  <Card.Text>
                    <strong>Email:</strong> {student.email}
                  </Card.Text>
                  <Card.Text>
                    <strong>Phone:</strong> {student.phone}
                  </Card.Text>
                  <Card.Text className="fw-semibold">
                    <strong>Status: {student.status}</strong>{" "}
                    {student.status === "Active" ? (
                      <FaCheckCircle className="text-success ms-1" />
                    ) : (
                      <FaTimesCircle className="text-danger ms-1" />
                    )}
                  </Card.Text>

                  <Card.Text>
                    <strong>Enrolled Courses:</strong>
                  </Card.Text>
                  <ul className="list-unstyled"> 
                    {student.enrolledCourses.length > 0 ? (
                      student.enrolledCourses
                      .filter((courseObj) => {
                        if (courseStatusFilter !== "All" && courseObj.status !== courseStatusFilter) return false;

                        // Filter by fee status
                        const paid = courseObj.installments?.reduce((sum, inst) => sum + Number(inst.amount), 0) || 0;
                        const fees = Number(courseObj.customFees) || 0;
                    
                        if (feeStatus === "paid" && paid < fees) return false;
                        if (feeStatus === "remaining" && paid >= fees) return false;
                        if (searchQuery) {
                          if (!courseObj?.courseId?.name?.toLowerCase().includes(searchQuery.toLowerCase())) {
                            return false;
                          }
                        }
                        return true;
                      })
                      .map((courseObj, idx) => {
                        const totalInstallmentsPaid = courseObj.installments?.reduce(
                          (sum, inst) => sum + Number(inst.amount),
                          0
                        );
                        const customFeesValue = Number(courseObj.customFees);
                        const isFullyPaid = customFeesValue > 0 && totalInstallmentsPaid >= customFeesValue;
                        
                        const course = courseObj.courseId;
                        const courseName = course?.name || "Course not found";
                        const isEditing =
                          editState.studentId === student._id &&
                          editState.courseIndex === idx;

                        return (
                          <li key={idx} className="shadow-sm border-end-0 border border-bottom-0 border-top-0 border-3 border-primary-subtle mb-3 p-3 rounded-2">
                            {/* Show Payment Status Badge */}
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                {/* Left-aligned content like course name */}
                              </div>
                              <div>
                                {isFullyPaid ? (
                                  <span className="badge bg-success">Fees Paid</span>
                                ) : (
                                  <span className="badge bg-warning text-dark">Fees Remaining: ₹{customFeesValue - totalInstallmentsPaid}</span>
                                )}
                              </div>
                            </div>

                            {courseName} <br />
                            {isEditing ? (
                              <>
                                <Form.Control
                                  type="text"
                                  placeholder="Custom Duration"
                                  value={editValues.customDuration}
                                  onChange={(e) =>
                                    setEditValues({
                                      ...editValues,
                                      customDuration: e.target.value,
                                    })
                                  }
                                  className="mb-1"
                                />
                                {!isFullyPaid && (
                                  <>
                                    <Form.Control
                                      type="text"
                                      placeholder="Custom Fees"
                                      value={editValues.customFees}
                                      onChange={(e) =>
                                        setEditValues({
                                          ...editValues,
                                          customFees: e.target.value,
                                        })
                                      }
                                      className="mb-1"
                                    />
                                
                                    <Form.Control
                                      type="number"
                                      placeholder="Add Installment Amount"
                                      value={editValues.newInstallmentAmount}
                                      onChange={(e) =>
                                        setEditValues({
                                          ...editValues,
                                          newInstallmentAmount: e.target.value,
                                        })
                                      }
                                      className="mb-1"
                                    />
                                  </>
                                )}
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={() => handleSave(student)}
                                  className="me-1"
                                >
                                  Save
                                </Button>
                              </>
                            ) : (
                              <>
                                <strong>Custom Duration:</strong>{" "}
                                {courseObj.customDuration || "Not specified"} <br />
                                <strong>Custom Fees:</strong>{" "}
                                {courseObj.customFees || "Not specified"} <br />
                                {/* Show Installments */}
                                {courseObj.installments?.length > 0 && (
                                  <>
                                    <strong>Installments Paid:</strong>
                                    <ul className="ps-3">
                                      {courseObj.installments.map((inst, i) => (
                                        <li key={i}>
                                          ₹{inst.amount} on {new Date(inst.date).toLocaleDateString()}
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                )}

                                <Card.Text className="fw-semibold">
                                  <strong>Status: {courseObj.status} </strong>{" "}
                                  {courseObj.status === "InActive" ? (
                                    <FaTimesCircle className="text-danger ms-1" />
                                  ) : (
                                    <FaCheckCircle className="text-success ms-1" />
                                  )}
                                </Card.Text>
                                {courseObj.status !== "Completed" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline-primary"
                                      className="me-2"
                                      onClick={() =>
                                        handleEditClick(student._id, {
                                          ...courseObj,
                                          index: idx,
                                        })
                                      }
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline-secondary"
                                      className="me-2"
                                      onClick={() => handleToggleCourseStatus(student._id, idx)}
                                    >
                                      Toggle Course Status
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline-success"
                                      className="me-2"
                                      onClick={() => handleCourseCompleted(student._id, idx)}
                                    >
                                      Make Completed
                                    </Button>
                                  </>
                                )}


                              </>
                            )}
                          </li>
                        );
                      })
                    ) : (
                      <li>No courses enrolled</li>
                    )}
                  </ul>

                  <div className="d-flex flex-wrap justify-content-start gap-2 mt-auto">
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

        <ToastContainer position="top-right" autoClose={3000} closeOnClick pauseOnHover />
      </Container>
    </div>
  );
};

export default ManagementStudents;