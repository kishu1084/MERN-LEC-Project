import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Row, Col, Spinner} from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../../../utills';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Sidebar } from './AdminDashboard';

const TrainerUpload = () => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    quickIntro: '',
    linkedIn: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMore, setShowMore] = useState(false);

  const filteredTrainers = trainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  const fetchTrainers = async () => {
    try {
      const res = await axios.get(`${API_URL}/trainers/all`);
      setTrainers(res.data);
    } catch (err) {
      toast.error('Failed to fetch trainers');
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
    data.append('designation', formData.designation);
    data.append('quickIntro', formData.quickIntro);
    data.append('linkedIn', formData.linkedIn);
    if (image) data.append('image', image);

    try {
      setLoading(true);
      let res;
      if (editMode) {
        res = await axios.put(`${API_URL}/trainers/${editingId}`, data);
        toast.success('Trainer updated');
      } else {
        res = await axios.post(`${API_URL}/trainers/upload`, data);
        toast.success('Trainer uploaded');
      }

      setFormData({ name: '', designation: '', quickIntro: '', linkedIn: '' });
      setImage(null);
      setEditMode(false);
      setEditingId(null);
      fetchTrainers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (trainer) => {
    setFormData({
      name: trainer.name,
      designation: trainer.designation,
      quickIntro: trainer.quickIntro,
      linkedIn: trainer.linkedIn || '',
    });
    setEditMode(true);
    setEditingId(trainer._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trainer?')) return;
    try {
      await axios.delete(`${API_URL}/trainers/${id}`);
      toast.success('Trainer deleted');
      fetchTrainers();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleExportCSV = () => {
    const headers = "Name,Designation,Quick Intro,LinkedIn\n";
    const rows = filteredTrainers.map(t => 
      `${t.name},${t.designation},${t.quickIntro.replace(/,/g, ' ')},${t.linkedIn || 'N/A'}`
    ).join("\n");
  
    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Trainers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  useEffect(() => {
    fetchTrainers();
  }, []);

  return (
    <div className='d-flex'>
        <Sidebar />
        <Container className='py-4'>
        <h2 className="mb-4 fw-bold">Trainer Management</h2>
  
        <ToastContainer />
        <Row className="justify-content-md-center w-100">
            <Col md={12}>
            <Card className="p-4 shadow rounded-4">
                <h4 className="mb-4">{editMode ? 'Edit Trainer' : 'Add New Trainer'}</h4>
                <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group controlId="name" className="mb-3">
                            <Form.Label>Trainer Name</Form.Label>
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
                        <Form.Group controlId="designation" className="mb-3">
                            <Form.Label>Designation</Form.Label>
                            <Form.Control
                            type="text"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            required
                            />
                        </Form.Group>
                    </Col>
                </Row>


                <Row>
                    <Col>
                        <Form.Group controlId="linkedIn" className="mb-3">
                            <Form.Label>LinkedIn Profile Link</Form.Label>
                            <Form.Control
                            type="url"
                            name="linkedIn"
                            value={formData.linkedIn}
                            onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="image" className="mb-3">
                            <Form.Label>Trainer Image</Form.Label>
                            <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            required={!editMode}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group controlId="quickIntro" className="mb-3">
                            <Form.Label>Quick Intro</Form.Label>
                            <Form.Control
                            as="textarea"
                            rows={3}
                            name="quickIntro"
                            value={formData.quickIntro}
                            onChange={handleChange}
                            required
                            />
                        </Form.Group>
                    </Col>
                        <Col className="d-flex flex-column justify-content-end align-items-end">
                            <Button variant="primary" type="submit"  disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : editMode ? 'Update Trainer' : 'Upload Trainer'}
                            </Button>
                            {editMode && (
                                <Button
                                    variant="secondary"
                                    className="ms-2"
                                    onClick={() => {
                                        setEditMode(false);
                                        setFormData({ name: '', designation: '', quickIntro: '', linkedIn: '' });
                                        setImage(null);
                                        setEditingId(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Row className="align-items-center mt-5 mb-3 g-1">
                <Col md={11} >
                    <Form.Control
                    type="text"
                    className='w-100'
                    placeholder="Search by trainer name..."
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



            {/* Trainer List */}
            <Card className="mt-4 shadow rounded-4">
                <Card.Body>
                    <h5>All Trainers</h5>
                    <Row className="border-bottom py-2">
                    <Col xs={2} className="fw-bold">Name</Col>
                    <Col xs={2} className="fw-bold">Designation</Col>
                    <Col xs={2} className="fw-bold">Profile</Col>
                    <Col xs={3} className="fw-bold">Introduction</Col>
                    <Col xs={1} className="fw-bold">LinkedIn</Col>
                    <Col xs={2} className="fw-bold">Actions</Col>
                    </Row>
                    {filteredTrainers.length > 0 ? (
                    filteredTrainers.map((trainer) => (
                        <Row key={trainer._id} className="border-bottom py-2 align-items-center">
                        <Col xs={2}>{trainer.name}</Col>
                        <Col xs={2}>{trainer.designation}</Col>
                        <Col xs={2}>
                            <img
                            src={`${API_URL.replace('/api', '')}${trainer.image}`}
                            alt={trainer.name}
                            style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                            />
                        </Col>
                        <Col xs={3}>
                            <div
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: showMore ? 'none' : 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            >
                            {trainer.quickIntro}
                            </div>
                            {trainer.quickIntro.split(' ').length > 15 && (
                            <Button
                                variant="link text-black"
                                className="p-0 mt-1"
                                onClick={() => setShowMore((prev) => !prev)}
                            >
                                {showMore ? 'View Less' : 'View More'}
                            </Button>
                            )}
                        </Col>
                        <Col xs={1}>
                            {trainer.linkedIn ? (
                            <a href={trainer.linkedIn} target="_blank" rel="noreferrer">
                                View Profile
                            </a>
                            ) : (
                            'N/A'
                            )}
                        </Col>
                        <Col xs={2}>
                            <Button
                            variant="outline-primary"
                            className="me-2"
                            onClick={() => handleEdit(trainer)}
                            >
                            <FaEdit /> Edit
                            </Button>
                            <Button
                            variant="outline-danger"
                            onClick={() => handleDelete(trainer._id)}
                            >
                            <FaTrash /> Delete
                            </Button>
                        </Col>
                        </Row>
                    ))
                    ) : (
                    <Row>
                        <Col className="text-center" colSpan={6}>
                        No trainers available.
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

export default TrainerUpload;
