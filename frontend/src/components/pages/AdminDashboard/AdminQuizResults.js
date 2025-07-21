import React, { useEffect, useState } from "react";
import { fetchAllQuizSubmissions, deleteQuizzesByIds } from "../../../API/quizSubmissionApi";
import { Table, Form, InputGroup, Row, Col, Button } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { Sidebar } from "./AdminDashboard";
import {
  FaSortAmountUp,
  FaSortAmountDown,
  FaFileCsv,
  FaPercentage,
  FaUser,
  FaEnvelope,
  FaPen,
  FaStarHalfAlt,
  FaEyeSlash,
  FaClock,
  FaFileInvoice,
} from "react-icons/fa";
import './AdminQuizeResultsStyle.css';

const AdminQuizResults = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [minPercentage, setMinPercentage] = useState("");
  const [tabSwitchFilter, setTabSwitchFilter] = useState("all");
  const [quizTitleFilter, setQuizTitleFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchAllQuizSubmissions();
        setSubmissions(data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      }
    };
    getData();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((item) => item !== id)
        : [...prevSelectedIds, id]
    );
  };

  const handleDelete = async () => {
    console.log("Selected", selectedIds);
    try {
      const response = await deleteQuizzesByIds(selectedIds);  // Pass the array directly
      console.log("Response", response);

      // Refresh the data after deletion
      const data = await fetchAllQuizSubmissions();
      setSubmissions(data);
      setSelectedIds([]); // Clear selected IDs
    } catch (err) {
      console.error("Error deleting quiz submissions:", err);
    }
  };

  const quizTitles = [...new Set(submissions.map(sub => sub.quizId?.title).filter(Boolean))];

  const filteredSubmissions = submissions
    .filter((sub) => {
      if (!sub.total || sub.score == null) return false;
      const percentage = (sub.score / sub.total) * 100;

      const meetsPercentage = !minPercentage || percentage >= parseFloat(minPercentage);
      const meetsTabSwitch =
        tabSwitchFilter === "all" ||
        (tabSwitchFilter === "with" && sub.tabSwitchCount > 0) ||
        (tabSwitchFilter === "without" && (!sub.tabSwitchCount || sub.tabSwitchCount === 0));
      const meetsQuizTitle =
        quizTitleFilter === "all" || sub.quizId?.title === quizTitleFilter;

      return meetsPercentage && meetsTabSwitch && meetsQuizTitle;
    })
    .sort((a, b) =>
      sortOrder === "asc" ? a.score - b.score : b.score - a.score
    );

  const csvHeaders = [
    { label: "Student", key: "userId.name" },
    { label: "Email", key: "userId.email" },
    { label: "Quiz Title", key: "quizId.title" },
    { label: "Score", key: "score" },
    { label: "Total", key: "total" },
    { label: "Percentage", key: "percentage" },
    { label: "Correct", key: "correctCount" },
    { label: "Tab Switches", key: "tabSwitchCount" },
    { label: "Submitted At", key: "submittedAt" },
  ];

  const csvData = filteredSubmissions.map((sub) => ({
    "userId.name": sub.userId?.name,
    "userId.email": sub.userId?.email,
    "quizId.title": sub.quizId?.title,
    score: sub.score,
    total: sub.total,
    percentage: ((sub.score / sub.total) * 100).toFixed(2),
    correctCount: sub.correctCount,
    tabSwitchCount: sub.tabSwitchCount,
    submittedAt: new Date(sub.submittedAt).toLocaleString(),
  }));

  // Clear all filters
  const clearFilters = () => {
    setMinPercentage("");
    setTabSwitchFilter("all");
    setQuizTitleFilter("all");
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <h3 className="mb-3">
          <FaFileInvoice /> All Quiz Submissions
        </h3>
        <hr />

        {/* Filters */}
        <Row className="mb-3">
          <Col md={3}>
            <InputGroup>
              <InputGroup.Text>
                <FaPercentage />
              </InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="Min %"
                value={minPercentage}
                onChange={(e) => setMinPercentage(e.target.value)}
              />
            </InputGroup>
          </Col>

          <Col md={3}>
            <Form.Select
              value={tabSwitchFilter}
              onChange={(e) => setTabSwitchFilter(e.target.value)}
            >
              <option value="all">All Tab Switch States</option>
              <option value="with">With Tab Switches</option>
              <option value="without">Without Tab Switches</option>
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Select
              value={quizTitleFilter}
              onChange={(e) => setQuizTitleFilter(e.target.value)}
            >
              <option value="all">All Quiz Titles</option>
              {quizTitles.map((title, idx) => (
                <option key={idx} value={title}>
                  {title}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3} className="d-flex justify-content-end align-items-center gap-2">
            <Button
              variant="outline-dark"
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              title="Sort by score"
            >
              {sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
            </Button>

            <CSVLink
              data={csvData}
              headers={csvHeaders}
              filename={"quiz_submissions.csv"}
              className="btn btn-success"
            >
              <FaFileCsv className="me-1" /> Export CSV
            </CSVLink>

            {/* Clear Filters Button */}
            <Button
              variant="secondary"
              onClick={clearFilters}
              className="ms-2"
            >
              Clear Filters
            </Button>
          </Col>
        </Row>

        {/* Delete Button */}
        <Row className="mb-3">
          <Col className="d-flex justify-content-end">
            <Button variant="danger" onClick={handleDelete} disabled={selectedIds.length === 0}>
              Delete Selected Submissions
            </Button>
          </Col>
        </Row>

        {/* Table */}
        <Table striped bordered hover responsive className="w-100">
          <thead className="table-dark">
            <tr>
              <th>Select</th>
              <th><FaUser className="me-1" /> Student</th>
              <th><FaEnvelope className="me-1" /> Email</th>
              <th><FaPen className="me-1" /> Quiz Title</th>
              <th><FaStarHalfAlt className="me-1" /> Score</th>
              <th>Total</th>
              <th>Percentage</th>
              <th>Correct</th>
              <th><FaEyeSlash className="me-1" /> Tab Switches</th>
              <th><FaClock className="me-1" /> Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((sub, index) => {
              const percentage = ((sub.score / sub.total) * 100).toFixed(2);
              const highlight = sub.tabSwitchCount > 0;

              const rowStyle = highlight
                ? { backgroundColor: "#dc3545", fontWeight: "bold", color: "#ffffff" }
                : {};

              return (
                <tr key={index}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedIds.includes(sub._id)}
                      onChange={() => handleCheckboxChange(sub._id)}
                    />
                  </td>
                  <td style={rowStyle}>{sub.userId?.name}</td>
                  <td style={rowStyle}>{sub.userId?.email}</td>
                  <td style={rowStyle}>{sub.quizId?.title}</td>
                  <td style={rowStyle}>{sub.score}</td>
                  <td style={rowStyle}>{sub.total}</td>
                  <td style={rowStyle}>{percentage}%</td>
                  <td style={rowStyle}>{sub.correctCount}</td>
                  <td style={rowStyle}>{sub.tabSwitchCount}</td>
                  <td style={rowStyle}>{new Date(sub.submittedAt).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminQuizResults;