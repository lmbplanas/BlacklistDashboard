import axios from 'axios';
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

// Get all domains with their status
export const fetchDomains = async () => {
  try {
    // In a real app with a backend, this would be:
    // const response = await axios.get(`${API_BASE_URL}/domains`);
    // return response.data;
    
    // For the MVP, we'll use the local data loader
    return await loadDomainData();
  } catch (error) {
    console.error('Error fetching domains:', error);
    throw error;
  }
};

// Get summary statistics
export const fetchStats = async () => {
  try {
    // In a real app with a backend, this would be:
    // const response = await axios.get(`${API_BASE_URL}/domains/stats`);
    // return response.data;
    
    // For the MVP, we'll calculate stats from the local data
    const domains = await loadDomainData();
    
    const stats = {
      blocked: 0,
      pending: 0,
      overdue: 0
    };
    
    domains.forEach(domain => {
      ['globe', 'smart', 'dito'].forEach(provider => {
        if (domain[provider]?.status === 'blocked') stats.blocked++;
        else if (domain[provider]?.status === 'pending') stats.pending++;
        else if (domain[provider]?.status === 'overdue') stats.overdue++;
      });
    });
    
    return stats;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

// Refresh domain status
export const refreshDomainStatus = async () => {
  try {
    // In a real app with a backend, this would be:
    // const response = await axios.get(`${API_BASE_URL}/domains/refresh`);
    // return response.data;
    
    // For the MVP, we'll just reload the data
    return {
      message: 'Domain status refreshed',
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error refreshing domains:', error);
    throw error;
  }
};
