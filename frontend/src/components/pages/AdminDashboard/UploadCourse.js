import React, { useEffect, useState } from "react";
import { Container, Form, Button, Card, Row, Col, InputGroup, Modal, FormGroup, FormControl } from "react-bootstrap";
import { FaUpload, FaCheckCircle, FaTimesCircle, FaPlus, FaSearch,   FaRupeeSign, FaDownload, FaEdit, FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UploadCourse.css";
import { Sidebar } from "./AdminDashboard";
import { createCourses, DeleteCourseById, GetAllCourses, UpdateCourseById } from "../../../api";
import { notify } from "../../../utills";
import  {ToastContainer} from "react-toastify";
import { IMAGE_URL } from "../../../utills";
const UploadCourse = () => {
  

  // const [appliedFilters, setAppliedFilters] = useState({  
  //   duration: [2, 12],  
  //   fee: [1000, 10000],
  //   status: "All",  
  // });

  // const handleFilterChange = (e) => {
  //   setSelectedStatus(e.target.value);
  // }

  // const [showFilter, setShowFilter] = useState(false);

  const [coursedata, setcoursedata] = useState({
    name: "",
    description: "",
    outcome: "",
    duration: "",
    fee: "",
    file: null,
    image: null,
    studentsEnrolled: 0,
    status: "Active",
    type: "Software",
    subscription: "Premium",
  });

  const [courseList, setCourseList] = useState([]);
  const [copyCourse, setCopyCourse] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);
  const [filePreview, setFilePreview] = useState(null);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setcoursedata({ ...coursedata, [name]: value });
  };

  const handleFileChange = (e) => {
    setcoursedata({ ...coursedata, file: e.target.files[0] }); // Store actual file object
    const file = e.target.files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setFilePreview(previewUrl);
      }
    
  };
  
  const handleImageChange = (e) => {
      setcoursedata({ ...coursedata, image: e.target.files[0] }); // Store actual file object
      const file = e.target.files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImgPreview(previewUrl);
      }
  };
  
  const handleEdit = (course) => {
    const index = courseList.findIndex(c => c._id === course._id);
    setEditIndex(index);
    setcoursedata({ ...course });
    setShowPopup(true);
  }; 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const courseData = {
      name: coursedata.name,
      description: coursedata.description,
      outcome : coursedata.outcome,
      duration : coursedata.duration,
      fee :coursedata.fee,
      studentsEnrolled : coursedata.studentsEnrolled,
      status : coursedata.status,
      file : coursedata.file,  // Ensure these are actual File objects
      image : coursedata.image,
      type : coursedata.type,
      subscription : coursedata.subscription
  };
    
    if (editIndex !== null) {
     
      try {
        const updatedCourse = { ...coursedata }; // Keep all course details
        
        const { success, message } = await UpdateCourseById(courseList[editIndex]._id, updatedCourse);
        
        if (success) {
          notify(message, "success");
          
          feachAllCourses(); // Refresh list after update
        } else {
          notify(message, "error");
        }
      } catch (err) {
        console.error(err);
        notify("Failed to update course", "error");
      }
      setEditIndex(null);
    
    } else {
        try{
          const { success, message } = await createCourses(courseData);
          if (success) {
            notify(message, "success");
            
            feachAllCourses(); // Refresh list after update
          } else {
            notify(message, "error");
          }
        }
        catch (err) {
          console.error(err);
          notify("Failed to update course", "error");
        }
    }
    setcoursedata({ name: "", description: "", outcome: "", duration: "", fee: "", file: null, image: null,studentsEnrolled: 0, status: "Active", type: "Software", subscription: "Premium" });
    setShowPopup(false);
  };
  
  const feachAllCourses = async () => {
    try {
      const { data } = 
        await GetAllCourses();
        setCourseList(data);
        setCopyCourse(data);
    } catch (err) {
      console.error(err);
      notify('Failed to feach a course', 'error')
    }
  }
  useEffect(() => {
    feachAllCourses();
  },[]);

  const handleDeleteCourse = async (id) => {
    const confirmDelete = window.confirm("Are you Sure you want to delete this course?");
    if (confirmDelete){
      try {
        const {  success, message } = await DeleteCourseById(id);
        if(success){
          notify(message, 'success')
        }else{
          notify(message, 'error')
        }
        feachAllCourses()
      } catch (err) {
        console.error(err);
        notify('Failed to delete a course', 'error')
      }
    }
  }

  const handlecouseStatus = async (courseId) => {
    
    const { _id, status, name} = courseId;
    const obj = {
      name,
      status: status === "Active" ? "InActive" : "Active"
    }
    try {
      const {  success, message } = await UpdateCourseById(_id, obj);
      
      if(success){
        notify(message, 'success')
      }else{
        notify(message, 'error')
      }
      feachAllCourses()
    } catch (err) {
      console.error(err);
      notify('Failed to delete a course', 'error')
    }
  }

  const handleCloseModal = () => {
    const confirmClose = window.confirm("Are you sure you want to close? Unsaved changes will be lost.");
    if (confirmClose) {
      
      setShowPopup(false);
      setEditIndex(null);
      setcoursedata({ name: "", description: "", outcome: "", duration: "", fee: "", file: null, image: null,studentsEnrolled: 0, status: "Active",type: "Software",subscription: "Premium" });
    }
  };

  


  // const filteredCourses = courses.filter(course =>
  //   course.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //   (parseInt(course.duration) >= appliedFilters.duration[0] && parseInt(course.duration) <= appliedFilters.duration[1]) &&
  //   (parseInt(course.fee) >= appliedFilters.fee[0] && parseInt(course.fee) <= appliedFilters.fee[1]) &&
  //   ( appliedFilters.status === "All" || course.status.toLowerCase() === appliedFilters.status.toLowerCase())
  // );
  
  const [termOfSearch, setTermOfSearch] = useState(null);
  const handleSearch = () => {
    
    const term = searchTerm.toLowerCase();
    setTermOfSearch(term);
    const result = copyCourse.filter((item) => item.name.toLowerCase().includes(term));
    setCourseList(result);
    setIsSearching(true);
  };
  

  return (
    <div className="d-flex vh-100" style={{ overflowX: "hidden", width: "100vw" }}>
      <Sidebar className="h-100"/>
      <Container className="p-4">
        <strong><h3 className="mb-4 fw-bold">Course Management</h3></strong>
        <Button variant="primary" className="mb-3" onClick={() => { setShowPopup(true); setEditIndex(null); }}>
          <FaPlus /> Add Course
        </Button>
        <InputGroup className="mb-3">
          <Form.Control type="text" placeholder="Search Courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
          <Button variant="outline-secondary" onClick={handleSearch}><FaSearch /></Button>
        </InputGroup>
        
        {isSearching && (
          <Container className="search-container d-flex align-items-center justify-content-evenly">
            <div className="d-flex align-items-center">
              <FaSearch className="text-primary me-2" size={20} />
              <h5 className="text-primary fw-bold mb-0">Showing results for:</h5>
              <h4 className="fw-semibold mb-0 ms-2">{termOfSearch}</h4>
              <Button 
              variant="danger" 
              className="back-btn d-flex align-items-center"
              onClick={() => {
                setCourseList(copyCourse);
                setSearchTerm(""); 
                setIsSearching(false);
              }}
            >
              <FaTimesCircle className="me-2" /> Back to All Courses
            </Button>
            </div>
            
          </Container>
        )}

        <ToastContainer
          position='top-right'
          autoClose={3000}
          hideProgressBar={false}
        />

        <Modal show={showPopup} onHide={handleCloseModal} size="xl" centered>
          <Modal.Header closeButton>
            <Modal.Title>{editIndex !== null ? "Edit Course" : "Upload Course"}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <Form onSubmit={handleSubmit} className="p-0">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Course name</Form.Label>
                <Form.Control type="text" name="name" value={coursedata.name} onChange={handleChange} className="form-control-lg p-3 fs-4" required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Course Description</Form.Label>
                <Form.Control as="textarea" name="description" value={coursedata.description} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Outcome</Form.Label>
                <Form.Control type="text" name="outcome" value={coursedata.outcome} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Duration</Form.Label>
                <Form.Control type="text" name="duration" value={coursedata.duration} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">fee (INR)</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaRupeeSign /></InputGroup.Text>
                  <Form.Control type="text" name="fee" value={coursedata.fee} onChange={handleChange} required />
                </InputGroup>
              </Form.Group>

              <FormGroup className="mb-3">
                <Form.Label className="fw-bold">Student Enrolled</Form.Label>
                <InputGroup>
                  <FormControl type="number" name="studentsEnrolled" value={coursedata.studentsEnrolled} onChange={handleChange} required />
                </InputGroup>
              </FormGroup>

              <FormGroup className="mb-3">
                <Form.Label className="fw-bold">Status</Form.Label>
                <Form.Select name="status" value={coursedata.status} onChange={handleChange} required >
                  <option value="Active">Active</option>
                  <option value="InActive">InActive</option>
                </Form.Select>
              </FormGroup>

              <FormGroup className="mb-3">
                <Form.Label className="fw-bold">Course Type</Form.Label>
                <Form.Select name="type" value={coursedata.type} onChange={handleChange} required >
                  <option value="Software">Software</option>
                  <option value="Corporate">Corporate</option>
                </Form.Select>
              </FormGroup>

              <FormGroup className="mb-3">
                <Form.Label className="fw-bold">Subscription Type</Form.Label>
                <Form.Select name="subscription" value={coursedata.subscription} onChange={handleChange} required >
                  <option value="Premium">Premium</option>
                  <option value="Free">Free</option>
                </Form.Select>
              </FormGroup>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Upload Course File</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
                {coursedata.file && 
                  <p className="mt-2">Current File: <a href={filePreview} download>{filePreview}</a></p>
                 }
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Upload Course Image</Form.Label>
                <Form.Control type="file" onChange={handleImageChange} />
                {coursedata.image && <img src={imgPreview} alt="Current Course" width="100" height="100" />}
              </Form.Group>

              <Button variant="success" type="submit" className="w-100">
                <FaUpload /> {editIndex !== null ? "Update Course" : "Upload Course"}
              </Button>
              
            </Form>
          </Modal.Body>
        </Modal>

      <Row className="g-4">
        {courseList.map((course, index) => (
          <Col md={4} key={index}>
            <Card className="h-100 d-flex flex-column shadow-sm">
              {course.image && (
                <Card.Img
                  variant="top"
                  src={`${IMAGE_URL}/${course.image}`}
                  alt="Course Image"
                  className="img-fluid"
                  style={{ height: "300px", objectFit: "cover" }}
                />
              )}
              <Card.Body className="d-flex flex-column">
                <Card.Title>{course.name}</Card.Title>
                <Card.Text>{course.description}</Card.Text>
                <Card.Text><strong>Outcome:</strong> {course.outcome}</Card.Text>
                <Card.Text><strong>Duration:</strong> {course.duration}</Card.Text>
                <Card.Text><strong>Fee:</strong> ₹{course.fee}</Card.Text>
                <Card.Text><strong>Students Enrolled:</strong> {course.studentsEnrolled}</Card.Text>
                <Card.Text><strong>Subscription:</strong> {course.subscription}</Card.Text>
                <Card.Text className="fw-semibold">
                  <strong>Status:</strong> {course.status === "Active" ? (
                    <FaCheckCircle className="text-success ms-1" />
                  ) : (
                    <FaTimesCircle className="text-danger ms-1" />
                  )}
                </Card.Text>
                <Card.Text><strong>Course Type:</strong> {course.type}</Card.Text>

                {/* Wrap buttons in flex container for even spacing */}
                <div className="d-flex flex-wrap justify-content-start gap-2 mt-auto">
                  {course.file && (
                    <a
                      href={`${IMAGE_URL}/${course.file}`}
                      download={`${course.name.replace(/\s+/g, "_")}.pdf`}
                      className="text-decoration-none"
                    >
                      <Button className="border border-primary text-primary bg-transparent">
                        <FaDownload /> Download File
                      </Button>
                    </a>
                  )}
                  <Button variant="outline-warning" onClick={() => handleEdit(course,course._id)}>
                    <FaEdit /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteCourse(course._id)}>
                    <FaTrash /> Delete
                  </Button>
                  <Button variant="outline-info" onClick={() => handlecouseStatus(course)}>
                    Toggle Status
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

        
      </Container>
    </div>
  );
};

export default UploadCourse;

