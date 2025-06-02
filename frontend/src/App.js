import React, { useState, useEffect } from 'react';
import { Container, Toast } from 'react-bootstrap';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import StatusSummary from './components/StatusSummary';
import DomainTable from './components/DomainTable';
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
  const [stats, setStats] = useState({
    blocked: 0,
    pending: 0,
    overdue: 0
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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

  const handleRefreshComplete = async (refreshResult) => {
    console.log('Refresh completed, reloading data...');
    
    // Update lastUpdated with current timestamp
    setLastUpdated(new Date());
    setToastMessage('Domain data has been refreshed!');
    setShowToast(true);
    // Reload domains and stats
    try {
      const [newDomains, newStats] = await Promise.all([
        fetchDomains(),
        fetchStats()
      ]);
      setDomains(newDomains);
      setStats(newStats);
    } catch (error) {
      console.error('Error reloading data after refresh:', error);
    }
  };


  return (
    <div className="app">
      <Header lastUpdated={lastUpdated} onSearch={(value) => handleFilterChange('search', value)} onRefreshComplete={handleRefreshComplete} />
      <Toast 
        style={{ position: 'absolute', top: 20, right: 20 }}
        onClose={() => setShowToast(false)} 
        show={showToast} 
        delay={3000} 
        autohide
      >
        <Toast.Header>
          <strong className="me-auto">Blacklist Dashboard</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
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
