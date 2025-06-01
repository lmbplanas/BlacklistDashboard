import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import '../styles/Legend.css';

const Legend = () => {
  return (
    <div className="legend-container mb-4">
      <Card>
        <Card.Body>
          <h5 className="legend-title mb-3">Legend</h5>
          <Row className="legend-items">
            <Col xs={12} md={4} className="legend-item">
              <span className="legend-icon blocked">🟢</span>
              <span className="legend-text">Blocked</span>
            </Col>
            <Col xs={12} md={4} className="legend-item">
              <span className="legend-icon pending">🔴</span>
              <span className="legend-text">Pending (with countdown)</span>
            </Col>
            <Col xs={12} md={4} className="legend-item">
              <span className="legend-icon overdue">⚠️</span>
              <span className="legend-text">Overdue</span>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Legend;
