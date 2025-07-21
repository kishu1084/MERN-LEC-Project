import { useState, useEffect } from "react";
import { Row, Col, ListGroup, Button } from "react-bootstrap";
import { useNavigate} from "react-router-dom"; // Combined import
import { GetAllCourses } from "../../../api";
import {FaChevronRight } from "react-icons/fa";

import "../pages/Style.css";

export default function CourseFilter() {
    const [premiumCourse, setPremiumCourse] = useState([]);
    const [uniqueCourseTypes, setUniqueCourseTypes] = useState([]);
    const [selectedCourseType, setSelectedCourseType] = useState("Software"); // Default selected
    const navigate = useNavigate(); // Hook for navigation

    const handleViewDetails = (course) => {
        navigate(`/course/${course._id}#details`, { state: { course } });
      };
      
    const fetchAllCourses = async () => {
        try {
            const { data } = await GetAllCourses();

            const uniqueTypes = new Set();
            data.forEach(course => {
                if (course.status === "Active" && course.type) {
                    uniqueTypes.add(course.type);
                }
            });

            const uniqueCourseTypesArray = Array.from(uniqueTypes);

            const filteredPremiumCourses = data.filter(
                course => course.status === "Active" && course.subscription === "Premium"
            );

            setPremiumCourse(filteredPremiumCourses);
            setUniqueCourseTypes(uniqueCourseTypesArray);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAllCourses();
    }, []);

    const getFilteredCourses = () => {
        return premiumCourse.filter(course => course.type === selectedCourseType);
    };

    return (
        <div className="dropdown-menu full-width p-3">
            <Row>
                {/* Column 1: Unique Course Types */}
                <Col md={2}></Col>
                <Col md={3}>
                    <h5 className="mb-3 mx-3"><strong>Course Types</strong></h5>
                    <ListGroup>
                        {uniqueCourseTypes.map((type, index) => (
                            <div key={index} className="d-flex justify-content-between align-items-center rounded-1 px-2">
                                <ListGroup.Item
                                    action
                                    onClick={() => setSelectedCourseType(type)}
                                    className={`w-100 mt-2 d-flex justify-content-between align-items-center ${
                                        selectedCourseType === type ? "custom-active border border-0" : "border border-0 bg-white"
                                    }`}
                                >
                                    <span>{type}</span>

                                    <div className="d-flex align-items-center">
                                        
                                        <FaChevronRight />
                                    </div>
                                </ListGroup.Item>
                            </div>
                        ))}
                    </ListGroup>

                    {/* View All Courses Button */}
                    <Button variant="danger" className="mt-3 w-100" onClick={() => navigate("/ExclusiveCourses/#topbanner")}>
                        View All Courses
                    </Button>
                </Col>

                {/* Column 2: Premium Courses Based on Selected Type */}
                <Col md={6}>
                    <h5 className="mb-3">
                        <strong>{selectedCourseType} Courses</strong>
                    </h5>
                    <hr />
                    {getFilteredCourses().length > 0 ? (
                        <div className="d-flex flex-column gap-2"> {/* Vertical Stack */}
                            {getFilteredCourses().map((course, index) => (
                                <button
                                    key={index}
                                    className="bg-white text-start p-2 border border-0 w-100 "
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewDetails(course);
                                    }}
                                >
                                    {course.name}
                                </button>
                            ))}

                            {/* View All Courses Button */}
                            <div className="d-flex justify-content-end">
                            <Button
                                variant="outline-danger"
                                size="sm"
                                className="mt-2 w-25"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/courses/${selectedCourseType}`);
                                }}
                            >
                                View All {selectedCourseType} Courses
                            </Button>
                        </div>
                        </div>
                    ) : (
                        <p>No premium courses available for this category.</p>
                    )}
                </Col>

                <Col md={1}></Col>
            </Row>
        </div>
    );
}
