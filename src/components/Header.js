import React, { useState } from 'react';
import { Container, Row, Col, InputGroup, Form, Button } from 'react-bootstrap';
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
    <>
      <div className="gov-header">
        <Container fluid className="px-4">
          <Row>
            <Col xs={12}>
              <div className="gov-logos">
                <div className="d-flex align-items-center">
                  <img src="images/dict-logo.png" alt="DICT Logo" className="gov-logo" />
                  <img src="images/cicc-logo.png" alt="CICC Logo" className="gov-logo" />
                  <img src="images/npc-logo.png" alt="NPC Logo" className="gov-logo" />
                  <img src="images/ntc-logo.png" alt="NTC Logo" className="gov-logo" />
                </div>
                <div className="d-none d-md-block">
                  <p className="gov-title">REPUBLIC OF THE PHILIPPINES</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="dashboard-header">
        <Container fluid className="px-4">
          <Row className="align-items-center mb-3">
            <Col xs={12} md={8}>
              <h1 className="dashboard-title">MNOS Blacklist Monitor</h1>
              <p className="dashboard-subtitle">Real-time domain blocking status across Philippine Mobile Network Operators</p>
            </Col>
            <Col xs={12} md={4} className="text-md-end">
              <div className="last-updated-container d-flex align-items-center justify-content-md-end">
                <Button 
                  variant="link" 
                  className="refresh-button p-0 me-2" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <span className={isRefreshing ? 'spin-container' : ''}>
                    <FaSync />
                  </span>
                </Button>
                <span className="last-updated-text">
                  Last Updated: {moment(lastUpdated).format('YYYY-MM-DD HH:mm')}
                </span>
              </div>
            </Col>
          </Row>
          
          <Row className="mt-4">
            <Col xs={12}>
              <InputGroup className="search-container w-100">
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
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Header;
