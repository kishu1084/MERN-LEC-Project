import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Row, Col, Spinner, Badge} from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../../../utills';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Sidebar } from './AdminDashboard';

const ManageTestimonial = () => {
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    pripority: '',
    linkedIn: '',
    title: '',
    designation: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [Testimonial, setTestimonial] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTestimonial = Testimonial.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  const fetchTestimonial = async () => {
    try {
          const res = await axios.get(`${API_URL}/testimonial/all`);
          setTestimonial(res.data);
        } catch (err) {
          toast.error('Failed to fetch testimonial');
        }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('content', formData.content);
    data.append('pripority', formData.pripority);
    data.append('linkedIn', formData.linkedIn);
    data.append('title', formData.title);
    data.append('designation', formData.designation);
    if (image) data.append('image', image);

    try {
      setLoading(true);
      let res;
      if (editMode) {
        res = await axios.put(`${API_URL}/testimonial/${editingId}`, data);
        toast.success('testimonial updated');
      } else {
        res = await axios.post(`${API_URL}/testimonial`, data);
        toast.success('testimonial uploaded');
      }

      setFormData({ name: '', content: '', pripority: '', linkedIn: '', title: '', designation:'' });
      setImage(null);
      setEditMode(false);
      setEditingId(null);
      fetchTestimonial();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testimonial) => {
    setFormData({
      name: testimonial.name,
      content: testimonial.content,
      pripority: testimonial.pripority,
      linkedIn: testimonial.linkedIn,
      title: testimonial.title,
      designation: testimonial.designation,
    });
    setEditMode(true);
    setEditingId(testimonial._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
        await axios.delete(`${API_URL}/testimonial/${id}`);
        toast.success('Testimonial deleted');
        fetchTestimonial();
      } catch (err) {
        toast.error('Delete failed');
      }
  };

  const handleExportCSV = () => {
    const headers = "Name,content,Quick Intro,pripority\n";
    const rows = filteredTestimonial.map(t => 
      `${t.name},${t.content}`
    ).join("\n");
  
    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Testimonial.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  useEffect(() => {
    fetchTestimonial();
  }, []);

  return (
    <div className='d-flex'>
        <Sidebar />
        <Container className='py-4'>
        <h2 className="mb-4 fw-bold">Testimonial Management</h2>
  
        <ToastContainer />
        <Row className="justify-content-md-center w-100">
            <Col md={12}>
            <Card className="p-4 shadow rounded-4">
                <h4 className="mb-4">{editMode ? 'Edit testimonial' : 'Add New testimonial'}</h4>
                <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group controlId="name" className="mb-3">
                            <Form.Label>Testimonial Name</Form.Label>
                            <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="linkedIn" className="mb-3">
                            <Form.Label>Testimonial LinkedIn</Form.Label>
                            <Form.Control
                            type="url"
                            name="linkedIn"
                            value={formData.linkedIn}
                            onChange={handleChange}
                            required
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="title" className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>

                </Row>


                <Row>
                    
                    <Col>
                        <Form.Group controlId="content" className="mb-3">
                            <Form.Label>content</Form.Label>
                            <Form.Control
                            as="textarea"
                            rows={3}
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        {/* <Form.Group controlId="pripority" className="mb-3">
                            <Form.Label>Pripority</Form.Label>
                            <Form.Control
                            type="text"
                            name="pripority"
                            value={formData.pripority}
                            onChange={handleChange}
                            />
                        </Form.Group> */}
                        <Form.Group controlId="pripority" className="mb-3">
                          <Form.Label>Pripority</Form.Label>
                          <Form.Select
                            name="pripority"
                            value={formData.pripority}
                            onChange={handleChange}
                          >
                            <option value={"Hight"}>Hight</option>
                            <option value={"Low"}>Low</option>
                          </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="designation" className="mb-3">
                            <Form.Label>Designation</Form.Label>
                            <Form.Control
                            type="text"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Row>
                            <Col>
                                <Form.Group controlId="image" className="mb-3">
                                    <Form.Label>testimonial Image</Form.Label>
                                    <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    required={!editMode}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="d-flex flex-column justify-content-end align-items-end">
                            <Col >
                            {editMode && (
                                    <Button
                                        variant="secondary"
                                        className='me-3'
                                        onClick={() => {
                                            setEditMode(false);
                                            setFormData({ name: '', content: '', pripority: '' });
                                            setImage(null);
                                            setEditingId(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                )}
                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? <Spinner animation="border" size="sm" /> : editMode ? 'Update testimonial' : 'Upload testimonial'}
                                </Button>
                                
                            </Col>
                        </Row>
                    </Col>
                </Row>

                </Form>
            </Card>

            <Row className="align-items-center mt-5 mb-3 g-1">
                <Col md={11} >
                    <Form.Control
                    type="text"
                    className='w-100'
                    placeholder="Search by testimonial name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Col>
                <Col md={1} className="text-end">
                    <Button variant="success" className='w-100' onClick={handleExportCSV}>
                    Export CSV
                    </Button>
                </Col>
            </Row>



            {/* testimonial List */}
            <Card className="mt-4 shadow rounded-4">
                <Card.Body>
                    <h5>All Testimonial</h5>
                    <Row className="border-bottom py-2">
                    <Col xs={2} className="fw-bold">Name</Col>
                    <Col xs={7} className="fw-bold">content</Col>
                    
                    
                    <Col xs={3} className="fw-bold">Actions</Col>
                    </Row>
                    {filteredTestimonial.length > 0 ? (
                    filteredTestimonial.map((testimonial) => (
                        <Row key={testimonial._id} className="border-bottom py-2 align-items-center">
                        <Col xs={2}>
                          <Row>
                            {testimonial.name}
                            <Badge className='w-25'>{testimonial.pripority}</Badge>
                          </Row>
                          <Row>
                            <small>{testimonial.designation}</small>
                          </Row>
                          <Row>
                            <img
                              src={`${API_URL.replace('/api', '')}${testimonial.image}`}
                              alt={testimonial.name}
                              style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                            />
                          </Row>
                          
                        </Col>
                        <Col xs={7}>
                          <strong>Title: </strong>{testimonial.title}<br/>
                          {testimonial.content}<br/>
                          {testimonial.linkedIn && (
                              <div className="d-flex align-items-center mt-3">
                                <a
                                  href={testimonial.linkedIn}
                                  className="text-primary me-2"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  LinkedIn
                                </a>
                            </div>
                          )}
                        </Col>
                       
                        
                        <Col xs={3}>
                            <Button
                            variant="outline-primary"
                            className="me-2"
                            onClick={() => handleEdit(testimonial)}
                            >
                            <FaEdit /> Edit
                            </Button>
                            <Button
                            variant="outline-danger"
                            onClick={() => handleDelete(testimonial._id)}
                            >
                            <FaTrash /> Delete
                            </Button>
                        </Col>
                        </Row>
                    ))
                    ) : (
                    <Row>
                        <Col className="text-center" colSpan={6}>
                        No Testimonial available.
                        </Col>
                    </Row>
                    )}
                </Card.Body>
            </Card>


            </Col>
        </Row>
        </Container>
    </div>
  );
};

export default ManageTestimonial;
