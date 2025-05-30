# MNOS Blacklist Monitoring Dashboard

A public-facing monitoring dashboard to track real-time domain blocking status across Philippine Mobile Network Operators (MNOS). The system monitors whether submitted domains have been blacklisted within the 24-hour SLA.

## Features

- Real-time status monitoring with color-coded indicators
- Filtering and sorting capabilities
- Mobile-responsive design
- Status summary statistics
- Auto-refresh functionality

## Tech Stack

- **Frontend**: React.js with Bootstrap for UI components
- **Backend**: Node.js + Express (to be implemented)
- **Database**: CSV files (initial implementation)
- **Monitoring API**: Site24x7 API (to be integrated)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/BlacklistDashboard.git
   cd BlacklistDashboard
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
blacklist-dashboard/
├── public/
│   ├── data/           # CSV data files
│   └── index.html      # HTML entry point
├── src/
│   ├── components/     # React components
│   ├── styles/         # CSS files
│   ├── utils/          # Utility functions
│   ├── data/           # Data source files
│   ├── App.js          # Main application component
│   └── index.js        # JavaScript entry point
└── package.json        # Project dependencies
```

## Mobile Responsiveness

The dashboard is designed to be fully responsive across different device sizes:

- **Small screens** (< 768px): Single column layout with collapsible sections
- **Medium screens** (768px - 1024px): Two-column layout
- **Large screens** (> 1024px): Full desktop layout

## Future Enhancements

- Backend API integration with Site24x7
- User authentication for admin functions
- Database migration for larger datasets
- Advanced filtering and reporting features

## License

This project is licensed under the MIT License - see the LICENSE file for details.
