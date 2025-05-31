import React, { useState, useEffect } from 'react';
import { Table, Spinner, Card } from 'react-bootstrap';
import StatusIndicator from './StatusIndicator';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import TablePagination from './TablePagination';
import '../styles/DomainTable.css';

const DomainTable = ({ domains, isLoading, filters }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'domain',
    direction: 'ascending'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paginatedDomains, setPaginatedDomains] = useState([]);
  const totalPages = Math.ceil(domains.length / itemsPerPage);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedDomains(getSortedDomains().slice(startIndex, endIndex));
    
    // Reset to first page when filters change
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [domains, currentPage, itemsPerPage, sortConfig]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1); // Reset to first page
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedDomains = () => {
    const sortableItems = [...domains];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        // Handle nested properties for MNOS status columns
        if (sortConfig.key === 'globe_status' && a.globe && b.globe) {
          if (a.globe.status < b.globe.status) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a.globe.status > b.globe.status) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        } 
        else if (sortConfig.key === 'smart_status' && a.smart && b.smart) {
          if (a.smart.status < b.smart.status) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a.smart.status > b.smart.status) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        }
        else if (sortConfig.key === 'dito_status' && a.dito && b.dito) {
          if (a.dito.status < b.dito.status) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a.dito.status > b.dito.status) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        }
        // Handle regular properties
        else {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        }
      });
    }
    return sortableItems;
  };

  const shouldShowMnosColumn = (mnosName) => {
    return filters.mnos === 'All' || filters.mnos.toLowerCase() === mnosName.toLowerCase();
  };

  const renderStatusIndicator = (statusObj) => {
    if (!statusObj) return null;
    
    let timeInfo = null;
    if (statusObj.status === 'pending' && statusObj.timeCreated) {
      const createdTime = new Date(statusObj.timeCreated);
      const deadline = new Date(createdTime.getTime() + 24 * 60 * 60 * 1000);
      const now = new Date();
      const hoursLeft = Math.round((deadline - now) / (1000 * 60 * 60));
      
      if (hoursLeft > 0) {
        timeInfo = `${hoursLeft}h left`;
      }
    }

    return <StatusIndicator 
      status={statusObj.status} 
      timeRemaining={timeInfo} 
      tooltipText={`Status: ${statusObj.status}${statusObj.timeRemaining ? ` (${statusObj.timeRemaining})` : ''}`} 
    />;
  };

  // Get sort icon for the column
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
  };

  const renderCardView = (domains) => {
    return (
      <div className="domain-cards">
        {domains.length > 0 ? (
          domains.map((domain, index) => (
            <Card key={index} className="domain-card mb-3">
              <Card.Body>
                <div className="domain-card-header">
                  <h6 className="domain-name">{domain.domain}</h6>
                  <span className="domain-time">{domain.last_updated}</span>
                </div>
                <p className="website-name">{domain.website_name}</p>
                <div className="domain-category mb-2">{domain.category}</div>
                <hr />

                <div className="status-grid" style={{ 
                  gridTemplateColumns: `repeat(${getVisibleMnosCount()}, 1fr)` 
                }}>
                  {shouldShowMnosColumn('Globe') && (
                    <div className="status-item">
                      <span className="provider-label">Globe:</span>
                      <span className="status-value">{renderStatusIndicator(domain.globe)}</span>
                    </div>
                  )}
                  {shouldShowMnosColumn('Smart') && (
                    <div className="status-item">
                      <span className="provider-label">Smart:</span>
                      <span className="status-value">{renderStatusIndicator(domain.smart)}</span>
                    </div>
                  )}
                  {shouldShowMnosColumn('DITO') && (
                    <div className="status-item">
                      <span className="provider-label">DITO:</span>
                      <span className="status-value">{renderStatusIndicator(domain.dito)}</span>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))
        ) : (
          <div className="text-center p-3">
            No domains match the current filters
          </div>
        )}
      </div>
    );
  };

  const getVisibleMnosCount = () => {
    let count = 0;
    if (shouldShowMnosColumn('Globe')) count++;
    if (shouldShowMnosColumn('Smart')) count++;
    if (shouldShowMnosColumn('DITO')) count++;
    return count > 0 ? count : 1; // At least 1 column for layout purposes
  };

  return (
    <div className="domain-table mb-4">
      <Card>
        <Card.Body>
          <h5 className="table-title mb-3">Main Data Table</h5>
          
          {isLoading ? (
            <div className="text-center p-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
            <div className="d-none d-md-block">
              <div className="table-responsive">
                <Table hover className="domain-data-table">
                  <thead>
                    <tr>
                      <th onClick={() => requestSort('domain')} className="sortable-header">
                        Domain {getSortIcon('domain')}
                      </th>
                      <th onClick={() => requestSort('website_name')} className="sortable-header">
                        Website Name {getSortIcon('website_name')}
                      </th>
                      <th onClick={() => requestSort('category')} className="sortable-header">
                        Category {getSortIcon('category')}
                      </th>
                      {shouldShowMnosColumn('Globe') && (
                        <th onClick={() => requestSort('globe_status')} className="sortable-header status-cell">
                          Globe {getSortIcon('globe_status')}
                        </th>
                      )}
                      {shouldShowMnosColumn('Smart') && (
                        <th onClick={() => requestSort('smart_status')} className="sortable-header status-cell">
                          Smart {getSortIcon('smart_status')}
                        </th>
                      )}
                      {shouldShowMnosColumn('DITO') && (
                        <th onClick={() => requestSort('dito_status')} className="sortable-header status-cell">
                          DITO {getSortIcon('dito_status')}
                        </th>
                      )}
                      <th onClick={() => requestSort('last_updated')} className="sortable-header">
                        Updated {getSortIcon('last_updated')}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedDomains.length > 0 ? (
                      paginatedDomains.map((domain, index) => (
                        <tr key={index}>
                          <td className="domain-cell">{domain.domain}</td>
                          <td>{domain.website_name}</td>
                          <td>{domain.category}</td>
                          {shouldShowMnosColumn('Globe') && (
                            <td className="status-cell">{renderStatusIndicator(domain.globe)}</td>
                          )}
                          {shouldShowMnosColumn('Smart') && (
                            <td className="status-cell">{renderStatusIndicator(domain.smart)}</td>
                          )}
                          {shouldShowMnosColumn('DITO') && (
                            <td className="status-cell">{renderStatusIndicator(domain.dito)}</td>
                          )}
                          <td>{domain.last_updated}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4 + getVisibleMnosCount()} className="text-center">
                          No domains match the current filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              <TablePagination 
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={domains.length}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
            <div className="d-md-none">
              {renderCardView(paginatedDomains)}
              <TablePagination 
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={domains.length}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default DomainTable;
