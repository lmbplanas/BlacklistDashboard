import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <div className="gov-footer">
      <Container fluid className="px-4">
        <Row>
          <Col xs={12} md={6}>
            <div className="d-flex flex-wrap">
              <img src="images/dict-logo.png" alt="DICT Logo" className="footer-logo" />
              <img src="images/cicc-logo.png" alt="CICC Logo" className="footer-logo" />
              <img src="images/npc-logo.png" alt="NPC Logo" className="footer-logo" />
              <img src="images/ntc-logo.png" alt="NTC Logo" className="footer-logo" />
            </div>
            <p className="footer-text">© 2025 MNOS Blacklist Monitoring Dashboard. All Rights Reserved.</p>
          </Col>
          <Col xs={12} md={6} className="text-md-end">
            <p className="footer-text">A joint initiative of DICT, CICC, NPC, and NTC</p>
            <p className="footer-text">For inquiries: support@blacklistmonitor.gov.ph</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Footer;