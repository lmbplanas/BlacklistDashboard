import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import StatusSummary from './components/StatusSummary';
import DomainTable from './components/DomainTable';
import Legend from './components/Legend';
import Footer from './components/Footer';
import { fetchDomains, fetchStats } from './utils/api';
import './styles/App.css';

function App() {
  const [domains, setDomains] = useState([]);
  const [filteredDomains, setFilteredDomains] = useState([]);
  const [filters, setFilters] = useState({
    category: 'All',
    status: 'All',
    mnos: 'All',
    search: ''
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDomains();
        setDomains(data);
        setFilteredDomains(data);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error loading domain data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      loadData();
    }, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  // Apply filters when filters change
  useEffect(() => {
    let result = [...domains];

    // Apply category filter
    if (filters.category !== 'All') {
      result = result.filter(domain => domain.category === filters.category);
    }

    // Combined MNOS and status filter
    if (filters.mnos !== 'All' && filters.status !== 'All') {
      const mnosKey = filters.mnos.toLowerCase();
      const statusLower = filters.status.toLowerCase();
      
      result = result.filter(domain => 
        domain[mnosKey] && domain[mnosKey].status === statusLower
      );
    }
    
    // MNOS filter only
    else if (filters.mnos !== 'All') {
      const mnosKey = filters.mnos.toLowerCase();
      result = result.filter(domain => 
        domain[mnosKey] && domain[mnosKey].status
      );
    }

    // Status filter only
    else if (filters.status !== 'All') {
      const statusLower = filters.status.toLowerCase();
      result = result.filter(domain => {
        return (domain.globe && domain.globe.status === statusLower) ||
              (domain.smart && domain.smart.status === statusLower) ||
              (domain.dito && domain.dito.status === statusLower);
      });
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        domain => domain.domain.toLowerCase().includes(searchLower) || 
                  domain.website_name.toLowerCase().includes(searchLower)
      );
    }

    setFilteredDomains(result);
  }, [filters, domains]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: 'All',
      status: 'All',
      mnos: 'All',
      search: ''
    });
  };

  // State for summary statistics
  const [stats, setStats] = useState({
    blocked: 0,
    pending: 0,
    overdue: 0
  });

  // Load summary statistics
  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await fetchStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, [domains]);

  return (
    <div className="app">
      <Header lastUpdated={lastUpdated} onSearch={(value) => handleFilterChange('search', value)} />
      
      <Container fluid className="px-4 flex-grow-1">
        <FilterBar 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onClearFilters={clearFilters} 
        />
        
        <StatusSummary stats={stats} isLoading={isLoading} />
        
        <DomainTable 
          domains={filteredDomains} 
          isLoading={isLoading} 
          filters={filters}
        />
      </Container>
      
      <Footer />
    </div>
  );
}

export default App;
