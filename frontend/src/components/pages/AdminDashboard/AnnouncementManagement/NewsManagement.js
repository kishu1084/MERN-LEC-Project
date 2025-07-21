import React, { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col, Modal, Form, Badge, InputGroup } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { FaPlus, FaEdit, FaTrash, FaThumbtack, FaSearch, FaSyncAlt } from "react-icons/fa";
import { Sidebar } from "../AdminDashboard";
import { IMAGE_URL, notify } from "../../../../utills";
import { createNews,DeleteNewsById,GetAllNews, UpdateNewsById } from "../../../../API/newsAPI";

const NewsManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [newsList, setNewsList] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [filteredNews, setFilteredNews] = useState(newsList);
    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const [news, setNews] = useState([]);


    const fetchAllNews = async () => {
          try {
            const { data } = 
              await GetAllNews();
              setNewsList(data);
              
              setFilteredNews(data);
          } catch (err) {
            console.error(err);
            notify('Failed to feach events', 'error')
          }
      }

      
        useEffect(() => {
          fetchAllNews();
        },[]);
    
        const formatDateTimeLocal = (date) => {
          if (!date) return '';
          const d = new Date(date);
          return d.toISOString().split('T')[0]; // 'YYYY-MM-DD'
        };

    const [newsdata, setnewsdata] = useState({
      title: "",
      content: "",
      date: "",
      image: "",
      category: "",
      tags: "",
      priority: "Medium",
      status: "Draft",
      pinned: false,
  });

  const handleventStatus = async (newsId) => {
      const { _id, status, title } = newsId;
      const obj = {
        title,
        status: status === "Published" ? "Draft" : "Published"
      };
    
      try {
        const { success, message } = await UpdateNewsById(_id, obj);
    
        if (success) {
          notify(message, 'success');
        } else {
          notify(message, 'error');
        }
    
        fetchAllNews();
      } catch (err) {
        console.error(err);
        notify('Failed to update event status', 'error');
      }
    };


    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setnewsdata({ ...newsdata, [name]: type === "checkbox" ?checked : value});
    }

    const handleFileChange = (e) => {
      setnewsdata({ ...newsdata, image: e.target.files[0] }); // Store actual file object
      const file = e.target.files[0];
      
    };

    const handleSearch = () => {
        const term = searchInput.toLowerCase();
      
        const filtered = newsList.filter((news) => {
          return (
            news.title.toLowerCase().includes(term) ||
            news.content.toLowerCase().includes(term) 
          );
        });
      
        setFilteredNews(filtered);
      };
      
      const handleShowModal = (index = null) => {
        if (index !== null) {
          const selectedNews = newsList[index];
          setnewsdata({
            ...selectedNews,
            });
          setEditingIndex(index);
        } else {
          setnewsdata({
            title: "",
            content: "",
            date: "",
            image: "",
            category: "",
            tags: "",
            priority: "Medium",
            status: "Draft",
            pinned: false,
          });
          setEditingIndex(null);
        }
        setShowModal(true);
      };
      

  const handleCloseModal = () => {
    const confirmClose = window.confirm("Are you sure you want to close? Unsaved changes will be lost.");
    if (confirmClose) {
      
        setShowModal(false);
        setEditingIndex(null);
        setnewsdata({
          title: "",
          content: "",
          date: "",
          image: "",
          category: "",
          tags: "",
          priority: "Medium",
          status: "Draft",
          pinned: false,
        });
    }
    
  };


  const handleSave = async (e) => {
    e.preventDefault();

    const newsData = {
      title: newsdata.title,
      content: newsdata.content,
      date: newsdata.date,
      category:  newsdata.category,
      tags: newsdata.tags,
      priority: newsdata.priority,
      status : newsdata.status,
      pinned: newsdata.pinned,
      image: newsdata.image
    }

    
    const updatedNews = [...news];
      if (editingIndex !== null) {

        try{

          const updatedNew = { ...newsdata };

          const { success, message } = await UpdateNewsById(newsList[editingIndex]._id, updatedNew);
          
          if (success) {

            notify(message, "success");

            fetchAllNews();
          } else {
            notify(message, "error");
          }
        } catch(err){
          console.error(err);
          notify("Failed to update news", "error");
        }
        setEditingIndex(null);
      } else {
        const { success, message } = await createNews(newsData);
        if (success) {
          notify(message, "success");
          fetchAllNews();
        } else {
          notify(message, "error");
        }
      }
    
  
    setShowModal(false);
    setNews(updatedNews);
    setEditingIndex(null);
    setnewsdata({
      title: "",
      content: "",
      date: "",
      image: "",
      category: "",
      tags: "",
      priority: "Medium",
      status: "Draft",
      pinned: false,
    });
  };
  

  const handleEdit = (news) => {
    const index = newsList.findIndex(c => c._id === news._id);
    setEditingIndex(index);
    setnewsdata({ ...news});
    setShowModal(true);
  }
  
  

  const handleDelete = async (id) => {
      if (window.confirm("Are you Sure you want to delete this Event?")) {
        try {
                const {  success, message } = await DeleteNewsById(id);
                if(success){
                  notify(message, 'success')
                }else{
                  notify(message, 'error')
                }
                fetchAllNews();
                
            } catch (err) {
                console.error(err);
                notify('Failed to delete a course', 'error')
            }
      }
    };

  return (
    <div className="d-flex">
        <ToastContainer
                  position='top-right'
                  autoClose={3000}
                />
          <Sidebar />
          <Container className="py-4">
            <h2 className="mb-4 fw-bold">News Management</h2>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="primary" onClick={() => handleShowModal()}>
          <FaPlus className="me-1" /> Add News
        </Button>
      </div>

        <InputGroup className="mb-3" >
            <Form.Control
                type="text"
                placeholder="Search News..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button variant="primary" onClick={handleSearch}>
                <FaSearch />
            </Button>
        </InputGroup>

    
      <Row className="g-4">
  {newsList.length === 0 ? (
    <p className="text-muted fs-5">No news items added yet.</p>
  ) : (
    newsList.map((news, index) => (
      <Col
        md={newsList.length === 1 ? 12 : 4}
        xl={newsList.length === 1 ? 12 : 4}
        key={index}
        className="mb-4"
      >
        <Card className="h-100 shadow rounded-4 border-0">
          {news.image && (
            <Card.Img
            variant="top"
            src={`${IMAGE_URL}/${news.image}`}
            alt="News Cover"
            style={{ height: "250px", objectFit: "cover", borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}
          />
          
          )}
          <Card.Body className="p-4">
            <Card.Title className="d-flex justify-content-between align-items-start fs-5 fw-bold">
              {news.title}
              {news.pinned && <FaThumbtack title="Pinned" color="gold" size={18} />}
            </Card.Title>

            <div className="mb-2 text-muted small">
              <span className="me-2">{new Date(news.date).toLocaleDateString()}</span>
              {news.category && <Badge bg="secondary">{news.category}</Badge>}
            </div>

            <Card.Text className="mb-3" style={{ minHeight: "70px" }}>
              {news.content}
            </Card.Text>

           {news.tags && (
              <div className="mb-3 d-flex flex-wrap gap-1">
                {news.tags.split(",").map((tag, i) => (
                  <Badge key={i} bg="info" className="text-white">
                    #{tag.trim()}
                  </Badge>
                ))}
              </div>
            )}

            <div className="mb-3">
              <Badge
                bg={news.priority === "High" ? "danger" : news.priority === "Low" ? "secondary" : "warning"}
                className="me-2"
              >
                {news.priority}
              </Badge>
              <Badge bg={news.status === "Published" ? "success" : "info"}>{news.status}</Badge>
            </div>


            <div className="d-flex gap-2">
              <Button variant="outline-success" onClick={() => handleventStatus(news)}>
                <FaSyncAlt className="me-1"/>
                    Toggle Status
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                className="flex-grow-1"
                onClick={() => handleEdit(news,news._id)}
              >
                <FaEdit className="me-1" /> Edit
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                className="flex-grow-1"
                onClick={() => handleDelete(news._id)}
              >
                <FaTrash className="me-1" /> Delete
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    ))
  )}
</Row>

      <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingIndex !== null ? "Edit News" : "Add News"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Title*</Form.Label>
              <Form.Control name="title" value={newsdata.title} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Content*</Form.Label>
              <Form.Control as="textarea" name="content" rows={3} value={newsdata.content} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Date*</Form.Label>
              <Form.Control type="date" name="date" value={formatDateTimeLocal(newsdata.date)} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                    name="category"
                    value={newsdata.category}
                    onChange={handleChange}
                >
                    <option value="">-- Select Category --</option>
                    <option value="Achievement">Achievement</option>
                    <option value="Media">Media</option>
                    <option value="Update">Update</option>
                    <option value="Announcement">Announcement</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control name="tags" value={newsdata.tags} onChange={handleChange} />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Priority</Form.Label>
                  <Form.Select name="priority" value={newsdata.priority} onChange={handleChange}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={newsdata.status} onChange={handleChange}>
                    <option>Published</option>
                    <option>Draft</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mt-2">
              <Form.Check
                type="checkbox"
                label="Pin to Top"
                name="pinned"
                checked={newsdata.pinned}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editingIndex !== null ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </div>
  );
};
 export default NewsManagement;