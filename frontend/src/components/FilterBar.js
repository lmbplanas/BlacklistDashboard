import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import '../styles/FilterBar.css';

const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
  // Categories from the wireframe
  const categories = ['All', 'Gambling', 'Porn', 'Fraud'];
  
  // Status options
  const statuses = ['All', 'Blocked', 'Pending', 'Overdue'];
  
  // MNOS options
  const mnosList = ['All', 'Globe', 'Smart', 'DITO'];

  return (
    <div className="filter-bar mb-4">
      <div className="filter-container p-3">
        <Row className="align-items-center">
          <Col xs={12}>
            <h5 className="filter-heading mb-3">Filters & Controls</h5>
          </Col>
          
          <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
            <Form.Group>
              <Form.Label>Category:</Form.Label>
              <Form.Select 
                value={filters.category}
                onChange={(e) => onFilterChange('category', e.target.value)}
                aria-label="Filter by category"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
            <Form.Group>
              <Form.Label>Status:</Form.Label>
              <Form.Select 
                value={filters.status}
                onChange={(e) => onFilterChange('status', e.target.value)}
                aria-label="Filter by status"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
            <Form.Group>
              <Form.Label>MNOS:</Form.Label>
              <Form.Select 
                value={filters.mnos}
                onChange={(e) => onFilterChange('mnos', e.target.value)}
                aria-label="Filter by MNOS"
              >
                {mnosList.map(mnos => (
                  <option key={mnos} value={mnos}>{mnos}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col xs={12} sm={6} md={3} className="d-flex align-items-end justify-content-end">
            <Button 
              variant="outline-secondary" 
              onClick={onClearFilters}
              className="clear-filters-btn"
            >
              Clear Filters
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default FilterBar;
