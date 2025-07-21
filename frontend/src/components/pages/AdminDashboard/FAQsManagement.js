import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Form, Card, Row, Col, InputGroup, Container } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle, FaPlus, FaSearch, FaEdit, FaSyncAlt, FaTrash, FaFilter } from "react-icons/fa";
import { Sidebar } from './AdminDashboard';
import 'react-toastify/dist/ReactToastify.css';
import { axiosInstance } from '../../../utills';

const FAQsManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '', status: 'Active' });
  const [editFaqId, setEditFaqId] = useState(null);

  const [searchInput, setSearchInput] = useState('');
  const [searchTerms, setSearchTerms] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  // Fetch FAQs with filters
  const fetchFaqs = async () => {
    try {
      const response = await axiosInstance.get(`/all`, {
        params: {
          search: searchTerms.join(' '),
          status: statusFilter
        }
      });
      setFaqs(response.data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [searchTerms, statusFilter]);

  const handleChange = (e) => {
    setNewFAQ({ ...newFAQ, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setNewFAQ({ question: "", answer: "", status: "Active" });
    setEditFaqId(null);
  };

  const handleAddFaq = async () => {
    if (!newFAQ.question.trim() || !newFAQ.answer.trim()) return;

    try {
      const response = await axiosInstance.post('/create', newFAQ);
      setFaqs([response.data, ...faqs]);
      toast.success("FAQ added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error adding FAQ:", error);
      toast.error("Failed to add FAQ.");
    }
  };

  const handleUpdateFaq = async () => {
    try {
      const response = await axiosInstance.put(`/${editFaqId}`, newFAQ);
      const updatedList = faqs.map((faq) => (faq._id === editFaqId ? response.data : faq));
      setFaqs(updatedList);
      toast.success("FAQ updated successfully!");
      resetForm();
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast.error("Failed to update FAQ.");
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      await axiosInstance.delete(`/${id}`);
      setFaqs(faqs.filter((faq) => faq._id !== id));
      toast.success("FAQ deleted successfully!");
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error("Failed to delete FAQ.");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await axiosInstance.patch(`/${id}/toggle`);
      const updatedFaqs = faqs.map((faq) => (faq._id === id ? response.data : faq));
      setFaqs(updatedFaqs);
      toast.success("Status updated.");
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update status.");
    }
  };

  const handleEdit = (faq) => {
    setNewFAQ({ question: faq.question, answer: faq.answer, status: faq.status });
    setEditFaqId(faq._id);
  };

  const handleAddOrUpdate = () => {
    if (!newFAQ.question || !newFAQ.answer) {
      toast.warning('Please fill in all fields!');
      return;
    }
    editFaqId ? handleUpdateFaq() : handleAddFaq();
  };

  const handleSearch = () => {
    const trimmed = searchInput.trim();
    if (trimmed && !searchTerms.includes(trimmed)) {
      setSearchTerms([...searchTerms, trimmed]);
    }
    setSearchInput('');
  };

  const handleRemoveSearchTerm = (termToRemove) => {
    setSearchTerms(searchTerms.filter(term => term !== termToRemove));
  };

  const handleClearSearch = () => {
    setSearchTerms([]);
    setSearchInput('');
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchTerms.length === 0 || searchTerms.some(term =>
      faq.question.toLowerCase().includes(term.toLowerCase()) ||
      faq.answer.toLowerCase().includes(term.toLowerCase())
    );
    const matchesStatus = statusFilter === 'All' || faq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="d-flex">
      <Sidebar />
      <Container className="py-4">
        <h2 className="mb-4 fw-bold">FAQs Management</h2>

        {/* Form */}
        <Card className="mb-4">
          <Card.Body>
            <h5>{editFaqId ? 'Edit FAQ' : 'Add New FAQ'}</h5>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Question</Form.Label>
                  <Form.Control
                    type="text"
                    name="question"
                    value={newFAQ.question}
                    onChange={handleChange}
                    placeholder="Enter question"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Answer</Form.Label>
                  <Form.Control
                    type="text"
                    name="answer"
                    value={newFAQ.answer}
                    onChange={handleChange}
                    placeholder="Enter answer"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={newFAQ.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button variant={editFaqId ? 'warning' : 'primary'} onClick={handleAddOrUpdate}>
                  {editFaqId ? <><FaEdit className="me-1" /> Update</> : <><FaPlus className="me-1" /> Add</>}
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Search & Filter */}
        <InputGroup className="mb-2">
          <Form.Control
            type="text"
            placeholder="Search FAQs..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button variant="primary" onClick={handleSearch}><FaSearch /></Button>
          <Button variant="outline-secondary" onClick={() => setShowStatusFilter(!showStatusFilter)}>
            <FaFilter />
          </Button>
        </InputGroup>

        {showStatusFilter && (
          <Form.Group as={Col} md={3} className="mb-3">
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Form.Select>
          </Form.Group>
        )}

        {searchTerms.length > 0 && (
          <div className="mb-3">
            <span className="me-2 fw-bold">Search Terms:</span>
            {searchTerms.map((term, index) => (
              <span key={index} className="badge bg-info text-dark me-2 p-2">
                {term}
                <Button
                  variant="link"
                  className="text-dark text-decoration-none p-0 ps-2"
                  onClick={() => handleRemoveSearchTerm(term)}
                  style={{ fontSize: '1rem' }}
                >
                  ×
                </Button>
              </span>
            ))}
            <Button variant="outline-secondary" size="sm" onClick={handleClearSearch}>Clear All</Button>
          </div>
        )}

        {/* FAQs List */}
        {filteredFaqs.length === 0 ? (
          <p className="text-muted">No FAQs found.</p>
        ) : (
          filteredFaqs.map((faq) => (
            <Card key={faq._id} className={`mb-3 w-100 ${editFaqId === faq._id ? 'border border-warning shadow' : ''}`}>
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={3}>
                    <strong>Q:</strong> {faq.question}
                    {editFaqId === faq._id && (
                      <span className="ms-2 badge bg-warning text-dark">Editing</span>
                    )}
                  </Col>
                  <Col md={4}><strong>A:</strong> {faq.answer}</Col>
                  <Col md={1}>
                    {faq.status === "Active" ? (
                      <FaCheckCircle className="text-success" />
                    ) : (
                      <FaTimesCircle className="text-danger" />
                    )}
                  </Col>
                  <Col md={4}>
                    <Button variant="outline-primary"  onClick={() => handleEdit(faq)} className="me-3"><FaEdit /> Edit</Button>
                    <Button variant="outline-success"  onClick={() => handleToggleStatus(faq._id)} className="me-3"><FaSyncAlt /> Toggle Status</Button>
                    <Button variant="outline-danger"  onClick={() => handleDeleteFaq(faq._id)}><FaTrash /> Delete</Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        )}

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover />
      </Container>
    </div>
  );
};

export default FAQsManagement;
