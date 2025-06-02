import React from 'react';
import { Pagination, Form, Row, Col } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/TablePagination.css';

const TablePagination = ({ 
  currentPage, 
  totalPages, 
  itemsPerPage, 
  totalItems,
  onPageChange, 
  onItemsPerPageChange 
}) => {
  const handlePageChange = (page) => {
    onPageChange(page);
  };
  
  const handleItemsPerPageChange = (e) => {
    onItemsPerPageChange(parseInt(e.target.value));
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    let items = [];
    
    // Always show first page
    items.push(
      <Pagination.Item 
        key="first" 
        onClick={() => handlePageChange(1)} 
        active={currentPage === 1}
      >
        1
      </Pagination.Item>
    );
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(<Pagination.Ellipsis key="ellipsis-1" disabled />);
    }
    
    // Show pages around current page
    for (let page = Math.max(2, currentPage - 1); page <= Math.min(totalPages - 1, currentPage + 1); page++) {
      items.push(
        <Pagination.Item 
          key={page} 
          onClick={() => handlePageChange(page)} 
          active={currentPage === page}
        >
          {page}
        </Pagination.Item>
      );
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(<Pagination.Ellipsis key="ellipsis-2" disabled />);
    }
    
    // Always show last page if there are more than 1 page
    if (totalPages > 1) {
      items.push(
        <Pagination.Item 
          key="last" 
          onClick={() => handlePageChange(totalPages)} 
          active={currentPage === totalPages}
        >
          {totalPages}
        </Pagination.Item>
      );
    }
    
    return items;
  };

  return (
    <div className="pagination-container">
      <Row className="align-items-center">
        <Col xs={12} md={6} className="mb-3 mb-md-0">
          <Pagination size="sm">
            <Pagination.Prev 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <FaChevronLeft size={10} color='var(--secondary-color)'/> 
            </Pagination.Prev>
            {renderPaginationItems()}
            <Pagination.Next 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight size={10} color='var(--secondary-color)'/>
            </Pagination.Next>
          </Pagination>
        </Col>
        <Col xs={12} md={6} className="d-flex justify-content-md-end">
          <div className="items-per-page">
            <Form.Select 
              size="sm" 
              value={itemsPerPage} 
              onChange={handleItemsPerPageChange}
              className="items-per-page-select"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </Form.Select>
          </div>
          <div className="ms-3 showing-entries">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TablePagination;