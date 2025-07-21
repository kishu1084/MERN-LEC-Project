import React, { useEffect, useState } from "react";
import { FaSearch, FaInstagram, FaLinkedin, FaEnvelope, FaChevronDown, FaBars, FaTimes, FaChevronUp } from "react-icons/fa"; // Added FaBars for hamburger icon
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./TopHeader.css";
import { useAuth } from "../../context/AuthContext";
import Image from './logo.png';
import  {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UniqeCourseList from "../Viewer/components/UniqeCourseList";
import AuthModal from "./AuthModal";
import { getAllQuizzes } from "../../API/quizeApi";
import { Form } from "react-bootstrap";


export default function TopHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
    const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // New state to toggle the menu visibility
    const [quizeName, setQuizeName] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState();
const { user, logout } = useAuth();

const getActiveQuizIds = async () => {
    try {
        const allQuizzes = await getAllQuizzes();
        
        const activeQuizName = allQuizzes
            .filter(quiz => quiz.status.toLowerCase() === 'active') // safer, in case of casing
            
        setQuizeName(activeQuizName);
    } catch (error) {
        console.error('Error getting active quiz IDs:', error);
    }
};

useEffect(() => {
    getActiveQuizIds();
}, []);


    const handleLogout = async () => {
        await logout();
        navigate("/"); // Redirect to home or login
    }
    
    // Toggle the More dropdown visibility
    const toggleMoreDropdown = () => {
        setIsMoreDropdownOpen(!isMoreDropdownOpen);
    };
    // Toggle the Courses dropdown visibility
    const toggleCoursesDropdown = () => {
        setIsCoursesDropdownOpen(!isCoursesDropdownOpen);
    };

    // Toggle the menu visibility on smaller screens
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Scroll to section function
    const scrollToSection = (sectionId) => {
        if (location.pathname !== "/") {
            navigate("/", { replace: true });
    
            setTimeout(() => {
                document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
            }, 500); // Delay to ensure the page has loaded
        } else {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
        }
    };
    const [isOpen, setIsOpen] = useState(false); // State to control modal visibility
    useEffect (() => {
        if(user){console.log(user.role);}
    }, [user]);


    const handleQuizChange = async (e) => {
        const selectedId = e.target.value;
        setSelectedQuizId(selectedId);
      
        const userEmail = user.email; // or however you are storing user
      
        try {
            const response = await fetch(`http://localhost:5000/api/quizSubmission/checkAttempt?quizId=${selectedId}&userId=${userEmail}`);

          if (!response.ok) {
            throw new Error('Failed to fetch');
          }
          
          const data = await response.json();
      
          if (data.alreadyAttempted) {
            alert("You have already attempted this quiz. Cannot retake.");
          } else {
            navigate(`/quize/${selectedId}`);
          }
        } catch (error) {
          console.error('Error checking quiz attempt:', error);
          alert("Error checking quiz attempt. Please try again.");
        }
      };
      

      
    return (
        <div className="header">
            <div className="nav-header">
                <div className="social-icons">
                    
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                        <FaInstagram />
                    </a>
                    
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                        <FaLinkedin />
                    </a>
                    <a href="mailto:learning@ssm-infotech.com" rel="noopener noreferrer" className="social-icon-link">
                        <FaEnvelope />
                    </a>
                </div>
            </div>
            <div className="main-header">
                <div className="left-side">
                    <div className="logo-container" style={{ cursor: "pointer" }}>
                        <div className="l-container" >
                            <Link to="/">
                                <img src={Image} alt="SSM logo" />
                            </Link>
                        </div>
                        <p className="logo-name">Learning Excellence Center</p>
                    </div>
                    <div className="nav-container">

                        <div className="search-container">
                            <input 
                                type="text" 
                                className="search-input"
                                placeholder="Search...">                       
                            </input>
                            <FaSearch className="search-icon"/>
                        
                        </div>
                        <div className="menu-icon" onClick={toggleMenu}>
                            {isMenuOpen ? (
                                <FaTimes />
                            ) : (
                                <FaBars />
                            )}
                        </div>
                    </div>
                </div>
                <ToastContainer
                    position='top-right'
                    autoClose={3000}
                    hideProgressBar={false}
                />

                {/* Hamburger Icon for small screens */}
                
                {/* Right Side - This will be toggled when the menu is opened */}
                <div className={`right-side ${isMenuOpen ? 'open' : ''}`}>
                    <div className="quize-btn-container">
                        {user && user.role === "student" && (
                            <>
                                <Form.Group className="mb-3 quize-btn-container">
                                    <Form.Select 
                                        value={selectedQuizId} 
                                        onChange={handleQuizChange} 
                                        required
                                    >
                                        <option value="" disabled>Quiz</option>
                                        {quizeName.map((quiz, idx) => (
                                        <option key={idx} value={quiz._id}>
                                            {quiz.title}
                                        </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                            </>
                        )}
                    </div>

                    <div className="courses-btn-container">
                        <button className="courses-btn" onClick={toggleCoursesDropdown}>
                            Courses {isCoursesDropdownOpen ? (<FaChevronDown />) : (<FaChevronUp/>)}
                        </button>
                        {isCoursesDropdownOpen && (
                        <>
                            <div className="overlay" onClick={toggleCoursesDropdown}></div>
                            <UniqeCourseList />
                        </>
                    )}

                    </div>

                    <div className="more-btn-container">
                    <button className="more-btn" onClick={toggleMoreDropdown}>
                        More {isMoreDropdownOpen ? (<FaChevronDown />) : (<FaChevronUp/>)}
                    </button>
                    {isMoreDropdownOpen && (
                        <>
                            <div className="d-flex" onClick={toggleMoreDropdown}></div>
                            <div className="dropdown-menu m-2">
                                <button className="dropdown-link" onClick={() => scrollToSection('section1')}>Home</button>
                                <button className="dropdown-link" onClick={() => scrollToSection('section2')}>Courses</button>
                                <button className="dropdown-link" onClick={() => scrollToSection('section3')}>About</button>
                            </div>
                        </>
                    )}
                </div>


                    <Link to="/demo/#topbanner">
                        <button className="demo-video-btn">Get a Glimpse</button> 
                    </Link>
                    
                    <div className="flex items-center justify-center min-h-screen">
                    {user ? (
                        <>
                        <button onClick={handleLogout} className="log-in-btn">Logout</button>
                        </>
                    ) : (
                        <button onClick={() => setIsOpen(true)} className="log-in-btn">
                            Log In
                        </button>)}
                    
                        {isOpen && <AuthModal isOpen={isOpen} setIsOpen={setIsOpen} />}

                    </div>
                </div>
            </div>
        </div>
    );
}