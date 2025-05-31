import React from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import '../styles/StatusSummary.css';

const StatusSummary = ({ stats, isLoading }) => {
  return (
    <div className="status-summary mb-4">
      <Card>
        <Card.Body>
          <h5 className="summary-title mb-3">Status Summary</h5>
          
          {isLoading ? (
            <div className="text-center p-3">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Row>
                <Col xs={4} md={4} className="summary-item">
                  <div className="status-icon blocked">🟢</div>
                  <h6 className="status-label mt-2">Blocked</h6>
                  <div className="status-count">{stats.blocked}</div>
                </Col>
                <Col xs={4} md={4} className="summary-item">
                  <div className="status-icon pending">🔴</div>
                  <h6 className="status-label mt-2">Pending</h6>
                  <div className="status-count">{stats.pending}</div>
                </Col>
                <Col xs={4} md={4} className="summary-item">
                  <div className="status-icon overdue">⚠️</div>
                  <h6 className="status-label mt-2">Overdue</h6>
                  <div className="status-count">{stats.overdue}</div>
                </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default StatusSummary;
