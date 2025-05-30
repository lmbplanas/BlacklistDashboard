import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import '../styles/StatusSummary.css';

const StatusSummary = ({ stats, isLoading }) => {
  return (
    <div className="status-summary mb-4">
      <Card>
        <Card.Body>
          <h5 className="summary-title mb-3">Status Summary</h5>
          
          {isLoading ? (
            <div className="text-center">Loading statistics...</div>
          ) : (
            <Row className="text-center">
              <Col xs={12} md={4} className="summary-item">
                <div className="status-icon blocked">🟢</div>
                <div className="status-label">Blocked</div>
                <div className="status-count">{stats.blocked}</div>
              </Col>
              
              <Col xs={12} md={4} className="summary-item">
                <div className="status-icon pending">🔴</div>
                <div className="status-label">Pending</div>
                <div className="status-count">{stats.pending}</div>
              </Col>
              
              <Col xs={12} md={4} className="summary-item">
                <div className="status-icon overdue">⏱️</div>
                <div className="status-label">Overdue</div>
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
