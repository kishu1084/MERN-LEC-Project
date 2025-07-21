import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Form, Card, Row, Col, Table, Spinner, Container } from 'react-bootstrap';
import { FaTrash, FaPlus, FaEdit, FaSave } from 'react-icons/fa';
import { Sidebar } from './AdminDashboard';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../../utills';

const AssociatedCompanies = () => {
    const [name, setName] = useState('');
    const [logo, setLogo] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [updatedLogo, setUpdatedLogo] = useState(null);
    const [updatedLogoName, setUpdatedLogoName] = useState(''); // New state to hold the logo name
  
    const handleEdit = (company) => {
      setEditingId(company._id);
      setEditedName(company.name);
      setUpdatedLogo(null); // Reset the logo when editing a new company
      setUpdatedLogoName(company.logo); // Set the logo name to the current logo if available
    };
  
    const handleUpdate = async (id) => {
      if (!editedName && !updatedLogo) return toast.warning('No changes to update');
      
      const formData = new FormData();
      if (editedName) formData.append('name', editedName);
      if (updatedLogo) formData.append('logo', updatedLogo);
    
      try {
        await axios.put(`${API_URL}/companies/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Company updated');
        fetchCompanies();
        setEditingId(null);
        setUpdatedLogo(null);  // Reset the updatedLogo after update
        setUpdatedLogoName(''); // Reset the logo name after update
      } catch (err) {
        toast.error('Error updating company');
      }
    };
  
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${API_URL}/companies/all`);
        setCompanies(res.data.companies);
      } catch (err) {
        toast.error('Error fetching companies');
      }
    };
  
    useEffect(() => {
      fetchCompanies();
    }, []);
  
    const handleCreate = async (e) => {
      e.preventDefault();
      if (!name) return toast.warning('Company name is required');
  
      const formData = new FormData();
      formData.append('name', name);
      if (logo) formData.append('logo', logo);
  
      try {
        setLoading(true);
        const res = await axios.post(`${API_URL}/companies/create`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Company added successfully');
        setName('');
        setLogo(null);
        fetchCompanies();
      } catch (err) {
        toast.error('Error creating company');
      } finally {
        setLoading(false);
      }
    };
  
    const handleDelete = async (id) => {
      if (!window.confirm('Are you sure?')) return;
      try {
        await axios.delete(`${API_URL}/companies/${id}`);
        toast.success('Company deleted');
        fetchCompanies();
      } catch (err) {
        toast.error('Error deleting company');
      }
    };
  
    return (
      <div className="d-flex">
        <Sidebar />
        <Container fluid className="py-4">
          <h2 className="mb-4 fw-bold">Associated Companies Management</h2>
  
          {/* Add Company Form */}
          <Card className="mb-4 w-100">
            <Card.Body>
              <h5>Add New Company</h5>
              <Form onSubmit={handleCreate}>
                <Row className='w-100'>
                  <Col md={6}>
                    <Form.Group controlId="name">
                      <Form.Label>Company Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter company name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="logo">
                      <Form.Label>Company Logo</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={(e) => {
                          setLogo(e.target.files[0]);
                          setUpdatedLogoName(e.target.files[0].name); // Display selected logo name
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} className="d-flex align-items-end">
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? <Spinner size="sm" animation="border" /> : <><FaPlus className="me-1" /> Add</>}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
  
          <Form.Control
            type="text"
            placeholder="Search by company name"
            className="mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
  
          {/* Company List Table */}
          <h5 className="mb-3">Associated Companies List</h5>
          <Table striped bordered hover responsive className='w-100'>
            <thead>
              <tr className='w-100'>
                <th>Name</th>
                <th>Logo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies
                .filter((company) =>
                  company.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((company) => (
                  <tr key={company._id}>
                    <td>
                      {editingId === company._id ? (
                        <Form.Control
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdate(company._id)}
                        />
                      ) : (
                        company.name
                      )}
                    </td>
                    <td>
                      {editingId === company._id ? (
                        <>
                          <Form.Control
                            type="file"
                            onChange={(e) => {
                              setUpdatedLogo(e.target.files[0]);
                              setUpdatedLogoName(e.target.files[0].name); // Show file name
                            }}
                            className="mb-2"
                          />
                          {updatedLogoName && <small>{updatedLogoName}</small>} {/* Display logo name */}
                        </>
                      ) : company.logo ? (
                        <img
                          src={`${API_URL.replace('/api', '')}/uploads/logos/${company.logo}`}
                          alt={company.name}
                          style={{ width: '50px', height: '50px' }}
                        />
                      ) : (
                        'No logo'
                      )}
                    </td>
                    <td>
                      {editingId === company._id ? (
                        <Button size="sm" variant="success" onClick={() => handleUpdate(company._id)}>
                          <FaSave className="me-1" /> Save
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="warning"
                            className="me-2"
                            onClick={() => handleEdit(company)}
                          >
                            <FaEdit className="me-1" /> Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(company._id)}
                          >
                            <FaTrash className="me-1" /> Delete
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
  
          <ToastContainer />
        </Container>
      </div>
    );
  };
  
  export default AssociatedCompanies;
  
