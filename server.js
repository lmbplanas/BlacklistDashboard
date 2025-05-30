const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const csv = require('csv-parser');
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Helper function to read CSV data
const readCsvData = () => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.join(__dirname, 'public', 'data', 'domains.csv'))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// API endpoint to get all domains
app.get('/api/domains', async (req, res) => {
  try {
    const domains = await readCsvData();
    
    // Process domain data
    const processedDomains = domains.map(domain => {
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
        ...domain,
        globe: processStatus(domain.globe_status, domain.globe_submitted),
        smart: processStatus(domain.smart_status, domain.smart_submitted),
        dito: processStatus(domain.dito_status, domain.dito_submitted),
        last_updated: moment(domain.last_updated).format('HH:mm')
      };
    });
    
    res.json(processedDomains);
  } catch (error) {
    console.error('Error fetching domains:', error);
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
});

// API endpoint to get summary statistics
app.get('/api/domains/stats', async (req, res) => {
  try {
    const domains = await readCsvData();
    
    const stats = {
      blocked: 0,
      pending: 0,
      overdue: 0
    };
    
    domains.forEach(domain => {
      ['globe_status', 'smart_status', 'dito_status'].forEach(provider => {
        if (domain[provider] === 'blocked') stats.blocked++;
        else if (domain[provider] === 'pending') stats.pending++;
        else if (domain[provider] === 'overdue') stats.overdue++;
      });
    });
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// API endpoint to simulate refreshing domain status
app.get('/api/domains/refresh', async (req, res) => {
  try {
    // In a real app, this would call the Site24x7 API
    // For now, we'll just return the current data
    const domains = await readCsvData();
    res.json({ message: 'Domain status refreshed', timestamp: new Date() });
  } catch (error) {
    console.error('Error refreshing domains:', error);
    res.status(500).json({ error: 'Failed to refresh domains' });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
