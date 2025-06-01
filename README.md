# MNOS Blacklist Monitoring Dashboard

A public-facing monitoring dashboard to track real-time domain blocking status across Philippine Mobile Network Operators (MNOS). The system monitors whether submitted domains have been blacklisted within the 24-hour SLA.

## Features

- Real-time status monitoring with color-coded indicators
- Filtering and sorting capabilities
- Mobile-responsive design
- Status summary statistics
- Auto-refresh functionality
- Backend integration with Site24x7 monitoring API

## Tech Stack

- **Frontend**: React.js with Bootstrap for UI components
- **Backend**: Node.js + Express 
- **Database**: MongoDB (with Mongoose ORM)
- **Monitoring API**: Site24x7 API (to be integrated)
- **Scheduling**: node-cron for automated status checks

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or Atlas)
  
### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/BlacklistDashboard.git
   cd BlacklistDashboard
   ```

2. Install dependencies:
   ```
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. Set up environment variables:
   ```
   In /frontend/.env
   REACT_APP_API_URL=http://localhost:5000/api

   In /backend/.env
   SITE24X7_API_KEY=your_site24x7_authtoken_here 
   MONGODB_URI=mongodb://localhost:27017/mno_monitor PORT=5000
   ```

4. Start the development servers:
   ```
   In root directory
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
BlacklistDashboard/ 
├── frontend/ 
│ ├── public/ 
│ │ └── index.html      # HTML entry point 
│ └── src/ 
│ ├── components/       # React components 
│ ├── styles/           # CSS files 
│ ├── utils/            # Utility functions 
│ ├── App.js            # Main application component 
│ └── index.js          # JavaScript entry point 
├── backend/ 
│ ├── src/ 
│ │ ├── controllers/    # API controller functions 
│ │ ├── cron/           # Scheduled jobs 
│ │ ├── models/         # Database schemas 
│ │ ├── routes/         # API route definitions 
│ │ └── index.js        # Server entry point 
│ └── package.json      # Backend dependencies 
└── package.json        # Root project configuration
```

## API Endpoints

### Routes

- **GET /api/mno-statuses**  
  Returns all domain monitoring statuses across MNOs

- **GET /api/stats**  
  Returns aggregated statistics of domain statuses

- **POST /api/domains/refresh**  
  Triggers a manual refresh of domain statuses from Site24x7

## Database Schema

### MNO Status Schema
```javascript
   {
      domain: { type: String, required: true },
      mno: { 
         type: String, 
         required: true, 
         enum: ["Globe", "Smart", "DITO"] 
      },
      lastChecked: { type: Date, required: true },
      rawStatus: { 
         type: String, 
         required: true 
      }, // e.g. "Up" or "Down"
      computedState: { 
         type: String, 
         required: true, 
         enum: ["Blocked", "Pending", "Overdue"] 
      },
      responseTimeMs: { type: Number },
      errorMessage: { type: String }
   },
   { 
      timestamps: true 
   }
```

### Block Order Schema
### MNO Status Schema
```javascript
   {
      domain: { type: String, required: true, unique: true },
      issuedAt: { type: Date, required: true },
      reason: { type: String }
   }
```

## Mobile Responsiveness

The dashboard is designed to be fully responsive across different device sizes:

- **Small screens** (< 768px): Single column layout with collapsible sections
- **Medium screens** (768px - 1024px): Two-column layout
- **Large screens** (> 1024px): Full desktop layout

## Monitoring Logic
- **Blocked:** Site24x7 monitor reports domain as "Down" (status !== "0")
- **Pending:** Domain is "Up" (status === "0") and less than 24 hours since issuance
- **Overdue:** Domain is "Up" (status === "0") and more than 24 hours since issuance

## Future Enhancements

- User authentication for admin functions
- Advanced filtering and reporting features
- Email/SMS notifications for overdue domains
- Historical data tracking and trend analysis
- API integration with other monitoring services

## License

This project is licensed under the MIT License - see the LICENSE file for details.
