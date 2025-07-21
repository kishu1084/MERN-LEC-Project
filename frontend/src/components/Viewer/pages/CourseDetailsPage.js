import { useLocation } from 'react-router-dom';
import { useRef } from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { IMAGE_URL } from '../../../utills';
import { FaChevronRight } from 'react-icons/fa';
import { Link } from "react-router-dom";
import CourseBanner from '../components/CourseBanner';
import TopHeader from '../../pages/TopHeader';
import { useState, useEffect } from 'react';
import CourseInfoCard from '../components/CourseInfoCard';
import PerfectForList from '../components/PerfectForList';
import CourseComparison from '../components/CourseComparison';
import ComparisonTable from '../components/ComparisonTable';
import { GetAllCourses } from '../../../api';
import FAQComponent from '../components/FAQComponent';
import LearnerSupportCard from '../components/LearnerSupportCard';
import RelatedCoursesCarousel from '../components/RelatedCoursesCarousel';
import DynamicContentSwitcher from '../components/DynamicContentSwitcher';
import CourseArrayList from '../components/CourseArrayList';
import PaidCourseInfoCard from '../components/PaidCourseInfoCard';
import TrainerCardList from '../components/TrainerCardList';
import UpcomingEvent from '../components/UpcomingEvent';
import AutoScrollingLogos from '../components/AutoScrollingLogos';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';



const CourseDetailPage = () => {
  
  const { state } = useLocation();
  const course = state?.course;

  const location = useLocation();
  const detailsRef = useRef(null);

  useEffect(() => {
    if (location.hash === "#details" && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  const [head1, setHead1] = useState("");
  const [head2, setHead2] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [copyCourse, setCopyCourse] = useState([]);
  const [secondLastWord, setSecondLastWord] = useState("");
  const [type, setType] = useState("");


  const feachAllCourses = async () => {
          try {
            const { data } = 
              await GetAllCourses();
              setCourseList(data);
              setCopyCourse(data);
          } catch (err) {
            console.error(err);
          }
        }
  
  useEffect(() => {
    
    feachAllCourses();
    
    
    if (course?.name) {

      setType(course.subscription);
     
      const words = course.name.split(" ");
      if (words.length < 3) {
        setHead1(course.name);
        setHead2("");
      } else {
        const index = words.length - 2;
        setHead1(words.slice(0, index).join(" "));
        setHead2(words.slice(index).join(" "));
        
      }
      if(words.length < 2){
        setSecondLastWord(words[words.length - 1]);
      }
      else{
        setSecondLastWord(words[words.length - 2]);
      }
    }
  }, [course?.name,course.subscription],[]);

  if (!course) {
    return <p className="text-center text-danger mt-5">No course data found!</p>;
  }
  
  
  const bannerData = {
    headingLine1: head1,
    headingLine2:
                (
                  <>
                    {head2}
                    <span className="position-absolute top-0 end-0 border border-1 border-muted bg-white text-danger px-3 py-2 rounded-bottom-start text-uppercase fs-6 fw-semibold z-3 rounded-3">
                      {course.subscription}
                    </span>
                  </>
                ),
    description: `${course.description}`,
    phoneText: "For enquiries call:",
    phoneNumber: "18002102020",
    image: `${IMAGE_URL}/${course.image}`,
    type: course.subscription === "Free" ? "Free" : "Premium",
    
  };

  const courseInfoCardData = {
    title: "Who should enroll",
    subTitle:`in ${course.name} Course`,
    description: `These free ${course.name} courses are designed to help you build strong ${course.name} skills that 
          contribute to both personal development and career advancement. 
          Whether you're a student exploring new opportunities, a professional aiming to upskill, or a 
          leader refining your expertise, each ${course.name} course offers practical knowledge, real-world examples, and valuable tools to support your growth and success.
        `,
  }

  const courseBenefitData = {
    title:`What makes the ${course.name} course with`,
    subTitle: `SSM LEC Different?`,
    description : `Unlike general ${course.name} courses, this specialized ${course.name} for ${secondLastWord} program is tailored 
                    specifically for the dynamic and rapidly evolving ${secondLastWord} industry. It offers hands-on training, 
                    real-world case studies, and expert-led insights to help you strategically apply ${course.name} in areas 
                    like customer analytics, business decision-making, and revenue growth.`,
  }

  const contentData = {
    button1: {
      title: `${course.name} Industry Mentors`,
      points: [
        "Receive personalized guidance from industry leaders with years of experience.",
        "Engage in one-on-one mentorship sessions tailored to your career goals.",
        "Gain exclusive insights into industry trends, best practices, and real-world applications."
      ]
    },
    button2: {
      title: "Student Support",
      points: [
        "Access 24/7 chat and email support to resolve queries instantly.",
        "Get assigned a dedicated academic advisor for personalized learning guidance.",
        "Join a vibrant student community to collaborate on projects and share knowledge."
      ]
    },
    button3: {
      title: `${course.name} Course Q&A Forum`,
      points: [
        "Post your questions and receive expert answers from instructors and peers.",
        "Participate in engaging discussions to enhance your understanding of key concepts.",
        "Attend instructor-led Q&A sessions to clarify doubts and explore advanced topics."
      ]
    },
    button4: {
      title: `${course.name} Course Expert Feedback`,
      points: [
        "Receive constructive feedback on your assignments to improve your skills.",
        "Get personalized reviews and recommendations to refine your projects.",
        "Participate in regular feedback sessions to track your progress and set learning goals."
      ]
    }
  };

  const coursedurationdata = {
    points: [
      {
        title: "Short-Term Courses (3 to 6 Months)",
        details: [
          `Fundamental concepts of ${course.name}.`,
          "Hands-on training with essential tools.",
          "Practical skills like building web applications."
        ],
        bestFor: "Beginners, freshers, and professionals looking to enhance their expertise."
      },
      {
        title: "Mid-Term Courses (6 to 12 Months)",
        details: [
          `In-depth understanding of ${course.name}, REST APIs, cloud deployment.`,
          "Hands-on practice with industry-standard tools.",
          "Case studies and project-based learning."
        ],
        bestFor: `Professionals transitioning into ${course.name} careers or looking for career growth.`
      },
      {
        title: "Long-Term Courses (12 to 24 Months)",
        details: [
          `Advanced topics in ${course.name}, including microservices and DevOps.`,
          "Hands-on experience with industry-relevant frameworks.",
          "Exposure to complex case studies and industry trends."
        ],
        bestFor: "Professionals aiming for senior roles like Software Engineer, Tech Lead, or CTO."
      }
    ]
  };

  const durationInfoCardData = {
    title: "Duration of ",
    subTitle: `for ${course.name}`,
    description: (
      <div className='text-muted'>
        In today’s dynamic learning landscape, {course.name} courses vary in duration,
        catering to different learning needs. At <strong>SSM LEC</strong>, we provide
        flexible, industry-relevant courses designed for beginners, professionals, and
        experts alike.
      </div>
    ),
  };
  
  
  

  return (
    <div className="d-flex flex-column align-items-center gap-3" ref={detailsRef} id="details" style={{ overflow: "hidden" }}>
        
        <TopHeader />
      
        <CourseBanner data={bannerData} minHeight="70vh" />
      
      
      
      <CourseInfoCard course={course} line={courseInfoCardData} id={1}>
        <PerfectForList secondLastWord={secondLastWord} />
      </CourseInfoCard>
        
      <CourseInfoCard course={course} line={courseBenefitData} id={2}>
        <CourseComparison name={course.name}/>
      </CourseInfoCard>

      <ComparisonTable/>
      <Container className="my-5 d-flex flex-column ">
        <Row className="mb-0 container-fluid align-content-start">
          <Col>
            <strong><h6 className="fw-bold text-start">RELATED COURSES</h6>
            <p className="text-danger fs-1 text-start">
              <span className="text-black">Learn More with</span> Similar Courses
            </p></strong>
          </Col>
        </Row>
      </Container>
      
      <RelatedCoursesCarousel
        courseList={courseList}
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

      <Container className="my-5 d-flex flex-column p-0 ">
        <h5 className="fw-bold text-center">Delivering Quality Training to 50+ Clients Nationwide</h5>
        <AutoScrollingLogos />
      </Container> 

      <UpcomingEvent />

      {
        course.subscription === "Premium" && 
          (<>
            
            <DynamicContentSwitcher contentData={contentData}  />
            <TrainerCardList id={2}/>
            <Testimonials />
            <PaidCourseInfoCard line={durationInfoCardData} id={2}>
              <CourseArrayList data={coursedurationdata} />
            </PaidCourseInfoCard>
        
            
            
            {/* <CourseDuration course={course} /> */}
            </>)
          
      }

      

    <Card className="d-flex flex-column border-0 align-self-start w-100 pt-0 mt-5" style={{paddingLeft:"12%", paddingRight:"10%"}}>
        <FAQComponent/>
    </Card>

    <LearnerSupportCard />
    <Footer />
    </div>
  );
};

export default CourseDetailPage;
