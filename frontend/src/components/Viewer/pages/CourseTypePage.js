import React, { useState, useEffect, useRef } from "react";
import CourseListSection from "../components/CourseListSection";
import { GetAllCourses } from "../../../api";
import { useNavigate, useLocation,  useParams } from 'react-router-dom';
import TopHeader from "../../pages/TopHeader";
import CourseBanner from "../components/CourseBanner";
import StatsCard from "../components/StatsCard";
import Banner from './coursetypeBanner.jpg';
import PaidCourseInfoCard from "../components/PaidCourseInfoCard";
import CourseDetailsComponent from "../components/CourseDetailsComponent";
import CourseComparison from "../components/CourseComparison";
import { Card,Row, Col, Container } from "react-bootstrap";
import FAQComponent from "../components/FAQComponent";
import LearnerSupportCard from "../components/LearnerSupportCard";
import ComparisonTable from "../components/ComparisonTable";
import CourseArrayList from "../components/CourseArrayList";
import AutoScrollingLogos from "../components/AutoScrollingLogos";
import TrainerCardList from "../components/TrainerCardList";
import UpcomingEvent from "../components/UpcomingEvent";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";


export default function CoursePage() {

    const [allCourseList, setAllCourseList] = useState([]);
    const [filterOptions, setFilterOptions] = useState([]);
    const [filterType, setFilterType] = useState('All');
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const navigate = useNavigate();
    const { courseType } = useParams(); // Get course type from the URL
    const courseInfoRef = useRef(null);
    const detailsRef = useRef(null);
    const location = useLocation();
      
    const bannerData = {
      headingLine1: "Master Your Skills ",
      headingLine2: `with Premium ${courseType} Courses`,
      description:
        `Take your learning to the next level with our expert-led premium
          ${courseType} courses. Get hands-on training, earn industry-recognized 
          certifications, and gain in-depth knowledge tailored to your career goals. 
          Stay ahead with exclusive content designed for professionals and learners who 
          strive for excellence.`,
      
      phoneText: "For enquiries call:",
      phoneNumber: "18002102020",
      image: Banner,
      type: "Inquirey",
    };

    const statsData = [
        { icon: "fa-solid fa-handshake",  label: "Industry Referrals" },
        { icon: "fa-solid fa-user-graduate",  label: "Expert Mentors" },
        { icon: "fa-solid fa-headset", label: "1:1 Mentorships" },
    ];

    const courseInfoCardData = {
      title: "Overview of ",
      subTitle:`SSM LEC ${courseType} Courses`,
      description: `Our ${courseType} courses are designed to equip learners with the 
      skills and knowledge needed to excel in today’s fast-evolving industries. 
      With flexible learning options, hands-on training, and expert guidance, 
      professionals and aspiring tech enthusiasts can upskill effectively while 
      balancing their careers.
          `,
    }

    const compairisonCourseInfoCardData = {
      title: "What Makes the Program ",
      subTitle:`with SSM LEC Unique`,
      description: `Our courses provide the cutting-edge skills needed in today’s 
              tech-driven world. With flexible and accessible learning options, 
              professionals can upskill while balancing their careers.
          `,
    }

    const whychooseInfoCardData = {
      title: "Why Choose ",
      subTitle:`SSM LEC for ${courseType}?`,
      description: `As industries evolve, professionals must stay ahead by upskilling 
                    in ${courseType}. SSM LEC offers top-tier ${courseType} 
                    programs designed to equip learners with cutting-edge knowledge, 
                    hands-on training, and career advancement opportunities.
          `,
    }

    const details = [
      { 
        title: "Who Is It For?", 
        content: [
          "Recent Graduates – Kickstart your career with industry-relevant skills and practical expertise.",
          "Working Professionals – Upgrade your skill set, transition into new roles, or stay ahead in your field.",
          "Tech Enthusiasts – Deepen your understanding of advanced concepts and emerging technologies.",
          "Career Changers – Explore new career paths in high-demand sectors and build a strong foundation."
        ] 
      },
      { 
        title: "What Will You Get?", 
        content: [
          "Comprehensive Learning – Gain in-depth knowledge of fundamental to advanced topics, aligned with industry trends.",
          "Hands-on Experience – Engage in real-world projects, interactive assignments, video lectures, and live sessions.",
          "Industry-Recognized Certifications – Enhance your professional profile with valuable credentials.",
          "Practical Skills for Success – Solve real-world challenges, apply solutions effectively, and stay competitive in your field."
        ] 
      }
    ]

    const courseBenefitsData = {
      points: [
          {
              title: "Top-Tier University & Industry Collaborations",
              details: [
                  "Programs developed in partnership with renowned universities and industry leaders.",
                  "Curriculum designed to meet the latest industry demands.",
                  "Accredited certifications and degrees from top institutions."
              ],
              bestFor: "Learners seeking globally recognized education and industry-aligned knowledge."
          },
          {
              title: "Flexible & Self-Paced Learning",
              details: [
                  "Blend of self-paced modules, live interactive sessions, and project-based learning.",
                  "Designed to fit into busy schedules for working professionals and students.",
                  "Accessible learning from anywhere in the world."
              ],
              bestFor: "Working professionals, students, and individuals with time constraints."
          },
          {
              title: "Comprehensive Course Offerings",
              details: [
                  "Wide range of specializations, from beginner to advanced levels.",
                  "Options including certification programs, diplomas, and degree courses.",
                  "Customized learning paths to match career aspirations."
              ],
              bestFor: "Individuals looking for tailored learning experiences in specialized fields."
          },
          {
              title: "Hands-On Learning with Real-World Projects",
              details: [
                  "Industry-relevant case studies, assignments, and projects.",
                  "Application of theoretical concepts in real-world scenarios.",
                  "Practical, job-ready training for career enhancement."
              ],
              bestFor: "Learners who prefer practical knowledge and hands-on experience."
          },
          {
              title: "Career Support & Job Assistance",
              details: [
                  "Resume-building guidance and interview preparation.",
                  "Job placement assistance through industry connections.",
                  "Support to transition into successful careers."
              ],
              bestFor: "Job seekers, career changers, and professionals aiming for career growth."
          },
          {
              title: "Affordable & Accessible Education",
              details: [
                  "Competitive pricing with flexible payment plans.",
                  "Scholarships and financial aid options available.",
                  "Cost-effective learning without compromising quality."
              ],
              bestFor: "Students and professionals looking for high-quality education at an affordable price."
          },
          {
              title: "Global Networking & Alumni Community",
              details: [
                  "Opportunities to connect with peers, industry experts, and mentors.",
                  "Exclusive access to alumni networks for career advancement.",
                  "Participation in networking sessions and industry events."
              ],
              bestFor: "Individuals looking to expand professional networks and explore career opportunities."
          },
          {
              title: "Tailored Program Durations",
              details: [
                  "Short-term certifications, diplomas, and full-fledged degrees available.",
                  "Courses ranging from a few months to two years.",
                  "Flexibility to choose the right program duration based on career goals."
              ],
              bestFor: "Learners looking for programs that align with their career timelines."
          }
      ]
  };
  

    useEffect(() => {
      if (location.hash === "#topbanner" && detailsRef.current) {
        detailsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [location]);


  const handleViewDetails = (course) => {
              
    navigate(`/course/${course._id}#details`, { state: { course } });
    
  };
  
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const { data } = await GetAllCourses();
        // Filter only active and free courses
        const filteredAllActiveCourses = data.filter(course => 
          course.status === 'Active' && course.type === `${courseType}`
        );
        // Remove duplicates based on _id
        const uniqueCourseSubscription = [...new Set(data.map((course) => course.subscription).filter(Boolean))];
        setFilterOptions([...uniqueCourseSubscription, "All"]);
        setAllCourseList(filteredAllActiveCourses);
        // setCourseTypeCount(courseTypeCounts); 
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllCourses();
    }, [courseType]);
  
    useEffect(() => {
      setFilteredCourses(
        allCourseList.filter((course) => filterType === "All" || course.subscription === filterType)
      );
    }, [filterType, allCourseList, showAll]);
    
    

    const visibleCourses = showAll ? filteredCourses : filteredCourses.slice(0, 3);


  return (
    <div className="d-flex flex-column align-items-center gap-3" ref={detailsRef} id="topbanner">
      <TopHeader />
     
      <CourseBanner data={bannerData} minHeight="60vh" scrollToRef={courseInfoRef}/>
      <StatsCard stats={statsData} type="Premium"/>

      <Container className="my-5 d-flex flex-column p-0 ">
        <h5 className="fw-bold text-center">Delivering Quality Training to 50+ Clients Nationwide</h5>
        <AutoScrollingLogos />
      </Container>
        

      <PaidCourseInfoCard  line={courseInfoCardData} id={1}>
          <CourseDetailsComponent details={details} />
      </PaidCourseInfoCard>

      <Container className="my-0 d-flex flex-column " ref={courseInfoRef}>
          <Row className="mb-0 container-fluid align-content-start">
          <Col>
            <strong><h6 className="fw-bold text-start text-uppercase">PREMIUM {courseType} COURSES</h6>
            <p className="text-danger fs-1 text-start">
              <span className="text-black">Enhance your </span> skills with expert-led courses
              </p></strong>
          </Col>
          </Row>
      </Container>
    
      <CourseListSection
          filterType={filterType}
          setFilterType={setFilterType}
          filterOptions={filterOptions}
          visibleCourses={visibleCourses}
          courseList={allCourseList}
          handleViewDetails={handleViewDetails}
          showAll={showAll}
          setShowAll={setShowAll}
          marginLeft="18%"
          
      />

      <ComparisonTable/>

      <PaidCourseInfoCard line={whychooseInfoCardData} id={1}>
        <CourseArrayList data={courseBenefitsData} />
      </PaidCourseInfoCard>

      <PaidCourseInfoCard  line={compairisonCourseInfoCardData} id={2}>
          <CourseComparison name={"SSM LEC"}/>
      </PaidCourseInfoCard>
      
      <UpcomingEvent />
      <TrainerCardList id={2}/>
      <Testimonials />

      <Card
        className="d-flex flex-column border-0 align-self-start w-100 pt-0 mt-5"
        style={{ paddingLeft: "12%", paddingRight: "10%" }}
      >
        <FAQComponent />
      </Card>
      <LearnerSupportCard />
      <Footer />
    </div>
  );
}
