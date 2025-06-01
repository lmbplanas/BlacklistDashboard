import axios from 'axios';
// Leave this import for fallback until backend is confirmed working
import { loadDomainData } from './dataLoader';

// Base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// For the MVP, we'll use the local data loader
// In production, these would be actual API calls
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Fetch all domains with their MNO statuses
 * @returns {Promise<Array>} Array of domain objects with status information
 */
export const fetchDomains = async () => {
  try {
    // Call the backend endpoint
    const response = await apiClient.get('/mno-statuses');
    return response.data;
    
    // Fallback to CSV data if needed - comment out when backend is ready
    // return await loadDomainData();
  } catch (error) {
    console.error('Error fetching domains:', error);
    console.log('Falling back to local CSV data...');
    return await loadDomainData();
  }
};

/**
 * Get summary statistics for domain statuses
 * @returns {Promise<Object>} Stats object with blocked, pending, overdue counts
 */
export const fetchStats = async () => {
  try {
    // Call the backend endpoint
    const response = await apiClient.get('/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);

    // Fallback to local CSV data for stats
    try {
      console.log('Computing stats from local data...');
      const domains = await loadDomainData();
      const stats = {
        blocked: 0,
        pending: 0,
        overdue: 0,
        total: domains.length
      };
      
      domains.forEach(domain => {
        ['globe', 'smart', 'dito'].forEach(provider => {
          if (domain[provider]?.status === 'blocked') stats.blocked++;
          else if (domain[provider]?.status === 'pending') stats.pending++;
          else if (domain[provider]?.status === 'overdue') stats.overdue++;
        });
      });
      
      return stats;
    } catch (fallbackError) {
      console.error('Error computing stats from local data:', fallbackError);
      throw error;
    }
  }
};

/**
 * Triggers a refresh of domain statuses
 * Note: The backend currently uses a cron job for refreshing
 * but doesn't expose a specific refresh endpoint.
 * @returns {Promise<Object>} Response message
 */
export const refreshDomainStatus = async () => {
  try {
    // This endpoint needs to be added to the backend
    // For now, we'll call /api/domains/refresh as specified in requirements
    const response = await apiClient.post('/domains/refresh');
    return response.data;
  } catch (error) {
    console.error('Error refreshing domain status:', error);
    
    // If backend refresh endpoint isn't implemented yet, fallback to reloading current data
    try {
      console.log('Falling back to reloading current data...');
      const domains = await loadDomainData();
      return {
        message: 'Reloaded data from local source',
        timestamp: new Date().toISOString(),
        domains
      };
    } catch (fallbackError) {
      console.error('Error in refresh fallback:', fallbackError);
      throw error; // Throw the original error
    }
  }
};