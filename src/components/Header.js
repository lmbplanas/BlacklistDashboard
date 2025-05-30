import React, { useState } from 'react';
import { Row, Col, InputGroup, Form, Button } from 'react-bootstrap';
import { FaSearch, FaSync } from 'react-icons/fa';
import moment from 'moment';
import { refreshDomainStatus } from '../utils/api';
import '../styles/Header.css';

const Header = ({ lastUpdated, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshDomainStatus();
      // The actual data refresh will be handled by the App component's useEffect
      // This is just to trigger the visual feedback
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="dashboard-header">
      <Row className="align-items-center mb-3">
        <Col xs={12} md={6}>
          <h1 className="dashboard-title">MNOS Blacklist Monitor</h1>
        </Col>
        <Col xs={12} md={6} className="d-flex justify-content-md-end mt-3 mt-md-0">
          <div className="d-flex align-items-center">
            <InputGroup className="me-2 search-container">
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search domains..."
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search domains"
              />
            </InputGroup>
            <div className="last-updated-container d-flex align-items-center">
              <Button 
                variant="link" 
                className="refresh-button p-0 me-2" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <FaSync className={isRefreshing ? 'spin' : ''} />
              </Button>
              <span className="last-updated-text">
                Last Updated: {moment(lastUpdated).format('YYYY-MM-DD HH:mm')}
              </span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Header;
