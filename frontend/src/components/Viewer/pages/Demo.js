import React, { useEffect, useState, useRef } from "react";
import TopHeader from "../../pages/TopHeader";
import { Card,Row, Col, Container, Button } from "react-bootstrap";
import './Style.css';
import { FaChevronRight } from 'react-icons/fa';
import Banner from './student.jpg';
import { GetAllCourses } from "../../../api";
import { notify } from "../../../utills";
import { ToastContainer } from "react-toastify";
import CourseBanner from "../components/CourseBanner";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import FAQComponent from "../components/FAQComponent";
import LearnerSupportCard from "../components/LearnerSupportCard";
import CourseListSection from "../components/CourseListSection";
import RelatedCoursesCarousel from "../components/RelatedCoursesCarousel";
import StatsCard from "../components/StatsCard";
import UpcomingEvent from "../components/UpcomingEvent";
import Footer from "../components/Footer";

export default function Demo({ scrollToRef }) {

  const courseInfoRef = useRef(null);

    const [courseList, setCourseList] = useState([]);
    const [premiumCourse, setPremiumCourse] = useState([]);
    const [filterType, setFilterType] = useState('All');

    const [showAll, setShowAll] = useState(false);

    const location = useLocation();
    const detailsRef = useRef(null);

  useEffect(() => {
    if (location.hash === "#topbanner" && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);


  // Slice courses: show first 4 or all
  const filteredCourses = filterType === 'All'
  ? courseList
  : courseList.filter(course => course.type === filterType);

const visibleCourses = showAll ? filteredCourses : filteredCourses.slice(0, 3);

    const navigate = useNavigate();

    const feachAllCourses = async () => {
      try {
        const { data } = await GetAllCourses();
    
        // Filter only courses that are active and free
        const filteredCourses = data.filter(course => 
          course.status === 'Active' && course.subscription === 'Free'
        );

        const filteredPremiumCourses = data.filter(course => 
          course.status === 'Active' && course.subscription === 'Premium'
        );
    
        setCourseList(filteredCourses);
        setPremiumCourse(filteredPremiumCourses);
      } catch (err) {
        console.error(err);
        notify('Failed to fetch courses', 'error');
      }
    };
    
    useEffect(() => {
      feachAllCourses();
    }, []);
    

      const handleViewDetails = (course) => {
        
        navigate(`/course/${course._id}#details`, { state: { course } });
        
      };



      const bannerData = {
        headingLine1: "Build Your Skills Daily",
        headingLine2: "with Free Courses",
        description:
          "Stay ahead in your career with expert-led, industry-relevant courses—completely free! Whether you're exploring new fields or sharpening your expertise, make learning a part of your routine and grow every day.",
        
        phoneText: "For enquiries call:",
        phoneNumber: "18002102020",
        image: Banner,
        type: "Explore Free Courses",
      };

      const statsData = [
        { value: "1000+", label: "Enrolled Learners" },
        { value: "500+", label: "Success Stories" },
        { value: "50+", label: "Job Ready Skills" }
      ];

    return(
        <div className="d-flex flex-column align-items-center gap-3" ref={detailsRef} id="topbanner" style={{ overflow: "hidden"}}>
            
          <TopHeader />
           
          <CourseBanner data={bannerData} minHeight="60vh" scrollToRef={courseInfoRef}/>
          <StatsCard stats={statsData} type="Free" />

          <Card className="d-flex flex-column border-0 align-self-start w-100" style={{paddingLeft:"11%", paddingTop:"2%"}} ref={courseInfoRef}>
              <h2 className="text-start m-5 fs-2 text-danger"><strong>Discover Our <span className="text-black">Free Courses</span></strong></h2>
          </Card> 

          <CourseListSection
            filterType={filterType}
            setFilterType={setFilterType}
            visibleCourses={visibleCourses}
            courseList={courseList}
            handleViewDetails={handleViewDetails}
            showAll={showAll}
            setShowAll={setShowAll}
            marginLeft="20%"  
          />

          <UpcomingEvent />

          <Container className="my-0 d-flex flex-column ">
            <Row className="mb-0 container-fluid align-content-start">
              <Col>
                <strong><h6 className="fw-bold text-start">PREMIUM COURSES</h6>
                <p className="text-danger fs-1 text-start">
                  <span className="text-black">Expand Your</span> Knowledge with Related Courses
                </p></strong>
              </Col>
            </Row>
          </Container>
                
          <RelatedCoursesCarousel
            courseList={premiumCourse}
          />

      <div className="d-flex justify-content-center my-3 mb-5">
          <Button
              as={Link}
              to="/ExclusiveCourses/#topbanner"
              className="fw-bold py-2 fs-5 px-0"
              variant="dark"
          >
              <div
              className="d-flex justify-content-between align-items-center px-4"
              style={{ minWidth: "220px" }}
              >
              <span>Explore All</span>
              <FaChevronRight />
              </div>
          </Button>
      </div>
            <Card className="d-flex flex-column border-0 align-self-start w-100 pt-0 mt-5" style={{paddingLeft:"12%", paddingRight:"10%"}}>
                <FAQComponent/>
            </Card>

            <LearnerSupportCard />
            <ToastContainer
                      position='top-right'
                      autoClose={3000}
                      hideProgressBar={false}
                      
            />
            <Footer/>
          </div>
        );
}