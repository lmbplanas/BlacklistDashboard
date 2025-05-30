import React, { useState } from 'react';
import { Table, Spinner, Card } from 'react-bootstrap';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import '../styles/DomainTable.css';

const DomainTable = ({ domains, isLoading }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'domain',
    direction: 'ascending'
  });

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted domains
  const getSortedDomains = () => {
    const sortableItems = [...domains];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  };

  // Render status indicator with countdown if applicable
  const renderStatusIndicator = (statusObj) => {
    if (!statusObj) return null;
    
    const { status, timeRemaining } = statusObj;
    
    if (status === 'blocked') {
      return <span className="status-indicator blocked">🟢</span>;
    } else if (status === 'pending') {
      return (
        <div className="status-indicator pending">
          <span>🔴</span>
          {timeRemaining && <span className="countdown">{timeRemaining}</span>}
        </div>
      );
    } else if (status === 'overdue') {
      return <span className="status-indicator overdue">⚠️</span>;
    }
    
    return <span>-</span>;
  };

  // Get sort icon for the column
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
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
                    <th onClick={() => requestSort('globe_status')} className="sortable-header">
                      Globe {getSortIcon('globe_status')}
                    </th>
                    <th onClick={() => requestSort('smart_status')} className="sortable-header">
                      Smart {getSortIcon('smart_status')}
                    </th>
                    <th onClick={() => requestSort('dito_status')} className="sortable-header">
                      DITO {getSortIcon('dito_status')}
                    </th>
                    <th onClick={() => requestSort('last_updated')} className="sortable-header">
                      Updated {getSortIcon('last_updated')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedDomains().length > 0 ? (
                    getSortedDomains().map((domain, index) => (
                      <tr key={index}>
                        <td className="domain-cell">{domain.domain}</td>
                        <td>{domain.website_name}</td>
                        <td>{domain.category}</td>
                        <td className="status-cell">{renderStatusIndicator(domain.globe)}</td>
                        <td className="status-cell">{renderStatusIndicator(domain.smart)}</td>
                        <td className="status-cell">{renderStatusIndicator(domain.dito)}</td>
                        <td>{domain.last_updated}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No domains match the current filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default DomainTable;
