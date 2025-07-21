import React from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';
import {
  CheckCircleFill,
  XCircleFill,
  Laptop,
  AwardFill,
  PersonBadgeFill,
  BriefcaseFill,
  PeopleFill,
} from 'react-bootstrap-icons';
import "../pages/Style.css";

const ComparisonTable = () => {
  const features = [
    { label: 'Access to Online Learning', icon: <Laptop className="me-2 text-danger" />, free: true, paid: true },
    { label: 'Certificate at Completion', icon: <AwardFill className="me-2 text-danger" />, free: false, paid: true },
    { label: 'Live Learning & Instructor Assistance', icon: <PersonBadgeFill className="me-2 text-danger" />, free: false, paid: true },
    { label: 'Recruitment Services', icon: <BriefcaseFill className="me-2 text-danger" />, free: false, paid: true },
    { label: 'Referral Benefits', icon: <PeopleFill className="me-2 text-danger" />, free: false, paid: true },
  ];

  return (
    <Container className="my-5 d-flex flex-column ">
      {/* Align heading to start */}
      <Row className="mb-4 container-fluid align-content-start">
        <Col>
          <strong><h6 className="fw-bold text-start">Free vs. Paid Courses: What Sets Them Apart?</h6>
          <p className="text-black fs-1 text-start">
            <span className="text-danger">Maximize</span> Your Learning Experience
          </p></strong>
        </Col>
      </Row>

      {/* Center the table */}
      <Row className="justify-content-center w-100">
        <Col md={12} lg={12}>
          <div className="rounded-5 border border-muted overflow-auto mx-auto shadow-bottom" style={{ width: '100%' }}>
            <Table bordered responsive className="text-start align-middle mb-0" style={{ minWidth: '600px' }}>
              <thead className="bg-white">
                <tr className="fw-bold text-center">
                  <th style={{ width: '40%' }} className="p-3">Feature</th>
                  <th className="p-3">Free Course</th>
                  <th className="text-danger p-3">Paid Course</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, idx) => {
                  const rowClass = idx % 2 === 0 ? 'bg-danger bg-opacity-10' : 'bg-white';
                  return (
                    <tr key={idx} className="fs-5">
                      <td className={`fw-semibold ${rowClass} p-3`}>
                        {feature.icon}
                        {feature.label}
                      </td>
                      <td className={`${rowClass} text-center`}>
                        {feature.free ? (
                          <CheckCircleFill className="text-success fs-5" />
                        ) : (
                          <XCircleFill className="text-danger fs-5" />
                        )}
                      </td>
                      <td className={`${rowClass} text-center`}>
                        {feature.paid ? (
                          <CheckCircleFill className="text-success fs-5" />
                        ) : (
                          <XCircleFill className="text-danger fs-5" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ComparisonTable;
