import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Button, Form, Card, Row, Col, InputGroup, Container,
} from 'react-bootstrap';
import {
  FaUpload, FaCheckCircle, FaTimesCircle, FaPlus,
  FaSearch, FaEdit, FaSyncAlt, FaTrash
} from 'react-icons/fa';
import { Sidebar } from './AdminDashboard';
import { uploadQuiz } from '../../../API/quizeApi';
import { deleteQuizById } from '../../../API/quizeApi';
import { updateQuizById } from '../../../API/quizeApi';
import { GetAllCourses } from '../../../api';
const API_URL = 'http://localhost:5000/api/quiz';

function QuizManager() {
  const [quizFile, setQuizFile] = useState(null);
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [password, setpassword] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('Active');
  const [courseOptions, setCourseOptions] = useState([]);

useEffect(() => {
  loadCourses();
}, []);

const loadCourses = async () => {
  const res = await GetAllCourses();
  if (res.success) {
    const uniqueCourseNames = [...new Set(res.data.map(course => course.name))];
    setCourseOptions(uniqueCourseNames);
  } else {
    toast.error("Failed to load courses");
  }
};
  

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch(`${API_URL}/all`);
      const data = await res.json();
      setQuizzes(data);
      setFilteredQuizzes(data);
    } catch (err) {
      console.error('Fetch Error:', err);
    }
  };

  const handleUpload = async () => {

    console.log(quizFile);
    if (!quizFile) return toast.warning('Please select a JSON file');
    try {
        const result = await uploadQuiz({ quizFile, title, course, password, status });
        toast.success(result.message || "Quiz uploaded!");
        fetchQuizzes();
        clearForm();
        // You can also refresh quizzes or clear the form here
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Upload failed");
      }
  };
  
  
  
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this FAQ?");
    if(confirmDelete){
        try {
            const result = await deleteQuizById(id);
            toast.success(result.message);
            fetchQuizzes(); // Refresh the list
          } catch (err) {
            console.error("Delete error:", err);
            toast.error(err.response?.data?.message || "Something went wrong during deletion");
          }
    }
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz); 
    setTitle(quiz.title);
    setCourse(quiz.course);
    setpassword(quiz.password);
    setStatus(quiz.status);
  };

  const handleUpdate = async () => {
    try {
        const updatedData = { title, course, password, status };
        const result = await updateQuizById(editingQuiz._id, updatedData);
    
        toast.success(result.message || 'Quiz updated');
        setEditingQuiz(null);
        fetchQuizzes();
        clearForm();
      } catch (err) {
        console.error('Update error:', err);
        toast.error(err.response?.data?.message || 'Something went wrong during update');
      }
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = quizzes.filter((quiz) =>
      quiz.title.toLowerCase().includes(query) ||
      quiz.course.toLowerCase().includes(query) 
    );
    setFilteredQuizzes(filtered);
  };

  const clearForm = () => {
    setQuizFile(null);
    setTitle('');
    setCourse('');
    setpassword('');
    
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'InActive' : 'Active';
  
    try {
      const result = await updateQuizById(id, { status: newStatus });
      toast.success(`Status changed to ${newStatus}`);
      console.log(result);
      fetchQuizzes(); // refresh
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error('Failed to toggle status');
    }
  };

  return (
    <>
    
    <style>
  {`
    .no-scroll-x {
      overflow-x: hidden;
    }
  `}
</style>
    <div className="d-flex w-100" style={{overflowX:"hidden"}}>
        <Sidebar />
    <div className="flex-grow-1 px-4 py-4" style={{ minWidth: 0 }}>
    <Container fluid className="px-0">
        
    <h2 className="mb-4 fw-bold"><FaUpload className="me-2" />Quiz Management</h2>

      <Card className="mb-4">
        <Card.Body>
          <Row className="mb-3">
            <Row>
            <Col md={4}>
                <Form.Group className="mb-3">
                <Form.Control
                    key={editingQuiz ? 'edit-input' : 'add-input'}
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                        console.log('Selected file:', e.target.files[0]);
                        setQuizFile(e.target.files[0]);
                    }}
                />
                    <Form.Label>Select Quiz JSON</Form.Label>
                </Form.Group>


            </Col>

            <Col md={4}>

              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Quiz Title"
                />
              </Form.Group>
            </Col>

            <Col md={4}>

            <Form.Group className="mb-3">
              <Form.Select value={course} onChange={(e) => setCourse(e.target.value)} required>
                <option value="">-- Select Course --</option>
                {courseOptions.map((name, idx) => (
                  <option key={idx} value={name}>{name}</option>
                ))}
              </Form.Select>
            </Form.Group>
              </Col>
              </Row>

              <Row>

              <Col md={4}>

              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  value={password}
                  onChange={e => setpassword(e.target.value)}
                  placeholder="password"
                />
              </Form.Group>

              </Col>

              <Col md={4}>

              <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Active">Active</option>
                <option value="InActive">InActive</option>
            </Form.Select>

              
              </Col>
                <Col md={4}>
              {editingQuiz ? (
                <Button variant="warning" onClick={handleUpdate}>
                  <FaSyncAlt className="me-2" />Update Quiz
                </Button>
              ) : (
                <Button variant="primary" onClick={handleUpload}>
                  <FaPlus className="me-2" />Upload Quiz
                </Button>
              )}


            </Col>
            </Row>
          </Row>
        </Card.Body>
      </Card>

      
   
    <InputGroup className="mb-2">
        <Form.Control
        type="text"
        placeholder="Search by title, course"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="secondary" onClick={handleSearch}>
        <FaSearch />
        </Button>
    </InputGroup>
            

      <h5 className="mb-3">Uploaded Quizzes</h5>
      {filteredQuizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        <div className="list-group">
          {filteredQuizzes.map((quiz) => (
            <Card
            key={quiz._id}
            className={`mb-3 w-100 ${
                editingQuiz && editingQuiz._id === quiz._id
                  ? 'border border-warning shadow'
                  : ''
              }`}              
          >
          
              <Card.Body>
                <Row className="align-items-center">
                <Col md={4}>
                    <Card.Text>
                    <strong>{quiz.title}</strong> ({quiz.course}) - {quiz.password} 
                    <br />
                    </Card.Text>
                </Col>
                <Col md={4}>
                    <Card.Text>
                        Status : {quiz.status}
                        {quiz.status === 'Active' ? <FaCheckCircle size={20} className="text-success" /> : <FaTimesCircle size={20} className="text-muted" />}
                    
                    </Card.Text>
                </Col>
                
                <Col md={4} className="text-end">
                
                  <Button
                    variant="outline-info"
                    className="me-2"
                    onClick={() => handleEdit(quiz)}
                  >
                    <FaEdit className="me-1" />Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="me-2"
                    onClick={() => handleDelete(quiz._id)}
                  >
                    <FaTrash className="me-1" />Delete
                  </Button>

                  <Button
                        variant="outline-success"
                        className="me-2"
                        onClick={() => handleToggleStatus(quiz._id, quiz.status)}
                    >
                        <FaSyncAlt className="me-1" />
                        Toggle
                  </Button>
                </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
      </Container>
    </div>
    </div></>
  );
}

export default QuizManager;
