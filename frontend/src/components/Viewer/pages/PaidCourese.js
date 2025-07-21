import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Card, Row, Col, Container, Button } from "react-bootstrap";
import { FaChevronRight } from "react-icons/fa";
import TopHeader from "../../pages/TopHeader";
import { GetAllCourses } from "../../../api";
import CourseBanner from "../components/CourseBanner";
import FAQComponent from "../components/FAQComponent";
import LearnerSupportCard from "../components/LearnerSupportCard";
import CourseListSection from "../components/CourseListSection";
import RelatedCoursesCarousel from "../components/RelatedCoursesCarousel";
import CourseComparison from "../components/CourseComparison";
import StatsCard from "../components/StatsCard";
import PaidCourseInfoCard from "../components/PaidCourseInfoCard";
import CourseDetailsComponent from "../components/CourseDetailsComponent";

import Banner from "./FreeCourseBanner.avif";
import "./Style.css";
import TrainerCardList from "../components/TrainerCardList";
import UpcomingEvent from "../components/UpcomingEvent";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

export default function PaidCourses({ scrollToRef }) {
    const courseInfoRef = useRef(null);
    const detailsRef = useRef(null);

    const [premiumCourse, setPremiumCourse] = useState([]);
    const [freeCourse, setFreeCourse] = useState([]);
    const [filterType, setFilterType] = useState("All");
    const [filterOptions, setFilterOptions] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [showAll, setShowAll] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.hash === "#topbanner" && detailsRef.current) {
            detailsRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [location]);

    const fetchAllCourses = async () => {
        try {
            const { data } = await GetAllCourses();

            console.log("Fetched Courses:", data);

            const filteredFreeCourses = data.filter(
                (course) => course.status === "Active" && course.subscription === "Free"
            );

            const filteredPremiumCourses = data.filter(
                (course) => course.status === "Active" && course.subscription === "Premium"
            );

            console.log(
                "Premium Courses:",
                filteredPremiumCourses.map((course) => ({
                    name: course.name,
                    courseType: course.type,
                    subscription: course.subscription,
                }))
            );

            const uniqueCourseTypes = [...new Set(data.map((course) => course.type).filter(Boolean))];

            setFilterOptions([...uniqueCourseTypes, "All"]);
            setFreeCourse(filteredFreeCourses);
            setPremiumCourse(filteredPremiumCourses);
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    };

    useEffect(() => {
        setFilteredCourses(
            premiumCourse.filter((course) => filterType === "All" || course.type === filterType)
        );
    }, [filterType, premiumCourse]);

    useEffect(() => {
        fetchAllCourses();
    }, []);

    const handleViewDetails = (course) => {
        navigate(`/course/${course._id}#details`, { state: { course } });
    };

    const visibleCourses = showAll ? filteredCourses : filteredCourses.slice(0, 3);

    const bannerData = {
        headingLine1: "Master Your Skills",
        headingLine2: "with Premium Courses",
        description:
            "Unlock exclusive, in-depth learning experiences with our expert-led paid courses. Get hands-on training, industry-recognized certifications, and career-enhancing knowledge tailored to your goals.",
        phoneText: "For enquiries call:",
        phoneNumber: "18002102020",
        image: Banner,
        type: "All Premium",
    };

    const statsData = [
        { icon: "fa-solid fa-handshake", label: "Industry Referrals" },
        { icon: "fa-solid fa-user-graduate", label: "Expert Mentors" },
        { icon: "fa-solid fa-headset", label: "1:1 Mentorships" },
    ];

    const courseInfoCardData = {
        title: "Overview of ",
        subTitle: "SSM LEC Courses",
        description:
            "Our courses provide the cutting-edge skills needed in today’s tech-driven world. With flexible and accessible learning options, professionals can upskill while balancing their careers.",
    };

    const comparisonCourseInfoCardData = {
        title: "How is ",
        subTitle: "Program with SSM LEC different?",
        description:
            "Our courses provide the cutting-edge skills needed in today’s tech-driven world. With flexible and accessible learning options, professionals can upskill while balancing their careers.",
    };

    const details = [
        {
            title: "Who Is It For?",
            content: [
                "Recent graduates looking to start their careers in tech and gain relevant skills for the future.",
                "Working professionals aiming to upskill, switch careers, or enhance their expertise in cutting-edge technologies.",
                "Tech enthusiasts who are passionate about learning advanced concepts and emerging technologies in the industry.",
                "Anyone seeking to explore deeper knowledge in technology fields or make a career transition into high-demand areas.",
            ],
        },
        {
            title: "What Will You Get?",
            content: [
                "A comprehensive understanding of fundamental to advanced concepts, including key industry trends and technologies.",
                "Hands-on learning through practical exercises, including video lectures, live sessions, assignments, and real-world projects to ensure a holistic experience.",
                "Access to valuable resources like industry-recognized certifications and tools that enhance professional profiles and open doors to new career opportunities.",
                "Skills and expertise that equip you to solve real-world industry challenges, stay competitive in the evolving tech landscape, and apply solutions in various contexts.",
            ],
        },
    ];

    return (
        <div className="d-flex flex-column align-items-center gap-3">
            <TopHeader />
            <div ref={detailsRef} id="topbanner" className="p-0 m-0 w-0 h-0"></div>
            <CourseBanner data={bannerData} minHeight="60vh" scrollToRef={courseInfoRef} />
            <StatsCard stats={statsData} type="Premium" />

            <PaidCourseInfoCard line={courseInfoCardData} id={1}>
                <CourseDetailsComponent details={details} />
            </PaidCourseInfoCard>

            <Container className="my-0 d-flex flex-column" ref={courseInfoRef}>
                <Row className="mb-0 container-fluid align-content-start">
                    <Col>
                        <h6 className="fw-bold text-start">PREMIUM COURSES</h6>
                        <p className="text-danger fs-1 text-start">
                            <span className="text-black">Enhance your </span> skills with expert-led courses
                        </p>
                    </Col>
                </Row>
            </Container>

            <CourseListSection
                filterType={filterType}
                setFilterType={setFilterType}
                filterOptions={filterOptions}
                courseList={premiumCourse}
                visibleCourses={visibleCourses}
                handleViewDetails={handleViewDetails}
                showAll={showAll}
                setShowAll={setShowAll}
                marginLeft="17%"
            />

            <div id="section2" className="h-auto p-0 justify-content-center align-content-center mb-5">
                <Container className="mt-3 d-flex flex-column p-0">
                    <Row className="container-fluid align-content-start">
                        <Col>
                            <h6 className="fw-bold text-start">FREE COURSES</h6>
                            <p className="text-black fs-1 text-start">
                                <span className="text-danger">Maximize</span> Your Learning Experience
                            </p>
                        </Col>
                    </Row>
                </Container>

                <RelatedCoursesCarousel courseList={freeCourse} />

                <div className="d-flex justify-content-center my-3 mb-5">
                    <Button as={Link} to="/demo/#topbanner" className="fw-bold py-2 fs-5 px-0" variant="dark">
                        <div className="d-flex justify-content-between align-items-center px-4" style={{ minWidth: "220px" }}>
                            <span>Explore All</span>
                            <FaChevronRight />
                        </div>
                    </Button>
                </div>
            </div>

            <PaidCourseInfoCard line={comparisonCourseInfoCardData} id={2}>
                <CourseComparison name="SSM LEC" />
            </PaidCourseInfoCard>

            <UpcomingEvent />
            
            <TrainerCardList id={1}/>
            <Testimonials />
            <Card className="d-flex flex-column border-0 align-self-start w-100 pt-0 mt-5" style={{paddingLeft:"13%"}}>
                <FAQComponent />
            </Card>

            <LearnerSupportCard />
            <Footer />
        </div>
    );
}