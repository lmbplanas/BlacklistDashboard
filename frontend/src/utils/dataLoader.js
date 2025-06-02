import Papa from 'papaparse';
import moment from 'moment';

// For the MVP, we'll load data from a local CSV file
// In a production environment, this would be replaced with an API call
export const loadDomainData = async () => {
  try {
    // In a real app, this would be an API call
    const response = await fetch('/data/domains.csv');
    const csvText = await response.text();
    
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          const processedData = results.data.map(row => {
            // Calculate time remaining for pending items
            const calculateTimeRemaining = (submittedTime) => {
              if (!submittedTime) return null;
              
              const submitted = moment(submittedTime);
              const deadline = moment(submittedTime).add(24, 'hours');
              const now = moment();
              
              if (now > deadline) return 'overdue';
              
              const hoursRemaining = deadline.diff(now, 'hours');
              const minutesRemaining = deadline.diff(now, 'minutes') % 60;
              
              return `${hoursRemaining}h ${minutesRemaining}m`;
            };
            
            // Process each MNOS status with time remaining
            const processStatus = (status, submittedTime) => {
              if (status === 'pending') {
                return {
                  status,
                  timeRemaining: calculateTimeRemaining(submittedTime)
                };
              }
              return { status, timeRemaining: null };
            };
            
            return {
              ...row,
              globe: processStatus(row.globe_status, row.globe_submitted),
              smart: processStatus(row.smart_status, row.smart_submitted),
              dito: processStatus(row.dito_status, row.dito_submitted),
              last_updated: moment(row.last_updated).format('HH:mm')
            };
          });
          
          resolve(processedData);
        }
      });
    });
  } catch (error) {
    console.error('Error loading domain data:', error);
    return [];
  }
};

// Mock function to simulate API call for refreshing status
export const refreshDomainStatus = async () => {
  // In a real app, this would call the Site24x7 API
  console.log('Refreshing domain status...');
  return await loadDomainData();
};
