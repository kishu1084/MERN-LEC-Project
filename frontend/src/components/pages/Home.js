import React, { useEffect, useState, useRef} from "react";
import { Card, Row, Col, Container, Button} from "react-bootstrap";
import TopHeader from "./TopHeader";
import { Link, useNavigate } from "react-router-dom";
import FAQComponent from "../Viewer/components/FAQComponent";
import LearnerSupportCard from "../Viewer/components/LearnerSupportCard";
import { GetAllCourses } from "../../api";
import { FaChevronRight } from 'react-icons/fa';
import RelatedCoursesCarousel from "../Viewer/components/RelatedCoursesCarousel";
import CourseListSection from "../Viewer/components/CourseListSection";
import { GetAllNews } from "../../API/newsAPI";
import AchiventCarousel from "../Viewer/components/AchiventCarousel";
import  BannerIMG  from './topbanner.avif';
import CourseBanner from "../Viewer/components/CourseBanner";
import StatsCard from "../Viewer/components/StatsCard";
import AutoScrollingLogos from "../Viewer/components/AutoScrollingLogos";
import TrainerCardList from "../Viewer/components/TrainerCardList";
import UpcomingEvent from "../Viewer/components/UpcomingEvent";
import Testimonials from "../Viewer/components/Testimonials";
import Footer from "../Viewer/components/Footer";

export default function Home() {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [freeCourseList, setFreeCourseList] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [premiumCourseList, setPremiumCourseList] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const courseInfoRef = useRef(null);
  

  const fetchAllNews = async () => {
    try {
      const { data } = await GetAllNews();
      const PublishedNews = data
        .filter(news => news.status === 'Published')
        .sort((a, b) => {
          // Pinned sorting first
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
  
          // Then by priority
          const priorityOrder = { High: 1, Medium: 2, Low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
  
      setNewsList(PublishedNews);
    } catch (err) {
      console.error(err);
    }
  };
    
          useEffect(() => {
            fetchAllNews();
    },[]);

  // Slice courses: show first 4 or all
  
  const visibleCourses = showAll ? filteredCourses : filteredCourses.slice(0, 3);


  const feachAllCourses = async () => {
    try {
      const { data } = await GetAllCourses();
  
      // Filter only active and free courses
      const filteredCourses = data.filter(course =>
        course.status === 'Active' && course.subscription === 'Free'
      );

      const filteredAllCourses = data.filter(course => 
        course.status === 'Active'&& course.subscription === 'Premium'
      );

      // Remove duplicates based on _id
      const uniqueCourses = filteredCourses.filter(
        (course, index, self) =>
          index === self.findIndex(c => c._id === course._id)
      );

      const uniqueCourseTypes = [...new Set(data.map((course) => course.type).filter(Boolean))];

      setFilterOptions([...uniqueCourseTypes, "All"]);
      
      setPremiumCourseList(filteredAllCourses);
      setFreeCourseList(uniqueCourses);
      

    } catch (err) {
      console.error(err);
    }
  };

  const handleViewDetails = (course) => {
        
    navigate(`/course/${course._id}#details`, { state: { course } });
    
  };
  
  
  useEffect(() => {
    feachAllCourses();
  }, []);

  useEffect(() => {
          setFilteredCourses(
            premiumCourseList.filter((course) => filterType === "All" || course.type === filterType)
          );
      }, [filterType, premiumCourseList]);
  
  useEffect(() => {
    const ids = freeCourseList.map(c => c._id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length > 0) {
      console.warn('Duplicate Course IDs:', duplicates);
    }
  }, [freeCourseList]);

  const bannerData = {
    headingLine1: "Transform Your Future",
    headingLine2: "with 100% Free Online Courses",
    description:
      "Join thousands of learners upgrading their skills with expert-led, job-ready courses. Learn at your pace, boost your career, and unlock endless opportunities — all for free!",
    phoneText: "Got questions? Talk to us:",
    phoneNumber: "18002102020",
    image: BannerIMG,
    type: "Start Learning Now",
  };
  
  const stats = [
    {
      icon: "fa-solid fa-chalkboard-teacher",
      label: "Learn From Experts",
    },
    {
      icon: "fa-solid fas fa-map-signs",
      label: "Guided Roadmaps",
    },
    {
      icon: "fas fa-phone-alt",
      label: "Direct Mentor Calls",
    },
  ];

  
  
  
  return (
    <div>
      <TopHeader />

      <div id="section1"className="d-flex flex-column align-items-center gap-3 mb-5">
        <CourseBanner data={bannerData} minHeight="50vh" scrollToRef={courseInfoRef} id={2}/>
        <StatsCard stats={stats} type="Premium" />
      </div>

      <Container className="my-5 d-flex flex-column p-0 ">
        <h5 className="fw-bold text-center">Delivering Quality Training to 50+ Clients Nationwide</h5>
        <AutoScrollingLogos />
      </Container> 

        <div id="section2" className="h-auto p-0 justify-content-center align-content-center mb-5 mt-4 " ref={courseInfoRef}>
            <Container className="mt-3 d-flex flex-column p-0">
                <Row className="container-fluid align-content-start">
                <Col>
                    <strong>
                      <h6 className="fw-bold text-start">FREE COURSES</h6>
                      <p className="text-black fs-1 text-start">
                          <span className="text-danger">Maximize</span> Your Learning Experience
                      </p>
                    </strong>
                </Col>
                </Row>
            </Container>

            <RelatedCoursesCarousel courseList={freeCourseList} />

            {/* Centering the button */}
            <div className="d-flex justify-content-center my-3 mb-5">
                <Button
                    as={Link}
                    to="/demo/#topbanner"
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

        </div>

        <div id="section2" className="h-auto p-0 justify-content-center align-content-center mt-5">
        <Container className="mt-3 d-flex flex-column p-0">
            <Row className="container-fluid align-content-start">
            <Col>
                <strong>
                <h6 className="fw-bold text-start">Best Courses to Enroll</h6>
                <p className="text-black fs-1 text-start">
                    <span className="text-danger">Upgrade</span> Your Skills with These Hits
                </p>
                </strong>
            </Col>
            </Row>
        </Container>

        
        </div>
        <Row className="m-0 p-0">
          <CourseListSection
              filterType={filterType}
              setFilterType={setFilterType}
              filterOptions={filterOptions}
              visibleCourses={visibleCourses}
              courseList={premiumCourseList}
              handleViewDetails={handleViewDetails}
              showAll={showAll}
              setShowAll={setShowAll}
              marginLeft="8%"
              flag="0"
          ></CourseListSection>

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
        </Row>

        <UpcomingEvent />

        <div id="section3">

          <TrainerCardList id={1}/>
          <Testimonials />

          <Container className="mt-3 d-flex flex-column p-0">
              <Row className="container-fluid align-content-start">
              <Col>
                  <strong>
                  <h6 className="fw-bold text-start">MILESTONES</h6>
                  <p className="text-danger fs-1 text-start mb-5">
                      <span className="text-black">Relive Our</span> Key Events & Achievements
                  </p>
                  </strong>
              </Col>
              </Row>
              
          </Container>

      
          <AchiventCarousel achivementList={newsList} />
          <Card
            className="d-flex flex-column border-0 align-self-start w-100 pt-0 mt-5"
            style={{ paddingLeft: "12%", paddingRight: "10%" }}
          >
            <FAQComponent />
          </Card>
          <LearnerSupportCard />
      </div>
      <Footer />
    </div>
  );
}