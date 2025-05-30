# MNOS Blacklist Monitoring Dashboard - MVP Wireframe & Documentation

## Project Overview
A public-facing monitoring dashboard to track real-time domain blocking status across Philippine Mobile Network Operators (MNOS). The system monitors whether submitted domains have been blacklisted within the 24-hour SLA.

## System Architecture

### Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js + Express
- **Database**: CSV files
- **Monitoring API**: Site24x7 API
- **Hosting**: Cloud service
- **Access**: Public read-only (no authentication)

## Wireframe Design

### Main Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    MNOS Blacklist Monitor                       │
│                                                                 │
│  [🔍 Search] [📊 Filter] [🔄 Last Updated: 2025-05-29 14:30]   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Filters & Controls                                              │
│ Category: [All ▼] Status: [All ▼] MNOS: [All ▼] [Clear Filters]│
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        Status Summary                           │
│  🟢 Blocked: 245   🔴 Pending: 58   ⏱️ Overdue: 12            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Main Data Table                            │
│ Domain ▲▼ │Website Name▲▼│Category▲▼│Globe▲▼│Smart▲▼│DITO▲▼│Updated▲▼│
├──────────┼──────────────┼─────────┼──────┼──────┼──────┼────────┤
│example.com│ Example Site │ Gambling │ 🟢   │ 🔴2h │ 🟢   │14:25   │
│badsite.ph │ Bad Website  │ Porn     │ 🔴8h │ 🟢   │ 🔴1h │13:45   │
│scam.net   │ Scam Portal  │ Fraud    │ 🟢   │ 🟢   │ 🟢   │12:30   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          Legend                                 │
│ 🟢 Blocked  🔴 Pending (with countdown)  ⚠️ Overdue             │
└─────────────────────────────────────────────────────────────────┘
```

## Data Structure

### CSV Database Schema

```csv
domain,website_name,category,globe_submitted,smart_submitted,dito_submitted,globe_status,smart_status,dito_status,last_updated
example.com,Example Site,Gambling,2025-05-29T10:00:00Z,2025-05-29T10:00:00Z,2025-05-29T10:00:00Z,blocked,pending,blocked,2025-05-29T14:25:00Z
badsite.ph,Bad Website,Porn,2025-05-29T06:00:00Z,2025-05-29T08:00:00Z,2025-05-29T13:00:00Z,overdue,blocked,pending,2025-05-29T13:45:00Z
```

### Status Values
- `pending`: Submitted but not yet blocked
- `blocked`: Confirmed blocked by MNOS
- `overdue`: Past 24-hour deadline
- `not_submitted`: Not yet submitted to this MNOS

## Feature Specifications

### 1. Real-time Status Monitoring
- **Color Coding**:
  - 🟢 Green: Domain is blocked
  - 🔴 Red: Pending with countdown timer
  - ⚠️ Orange: Overdue (past 24 hours)
- **Countdown Display**: Shows hours/minutes remaining until 24-hour deadline
- **Auto-refresh**: Dashboard updates every 5 minutes

### 2. Filtering & Sorting
- **Filter Options**:
  - Category (Gambling, Porn, Fraud, etc.)
  - Status (All, Blocked, Pending, Overdue)
  - MNOS (Globe, Smart, DITO, All)
- **Sort Options**: All columns sortable (A-Z, newest first, etc.)
- **Search**: Global search across domain names and website names

### 3. MNOS Columns
- **Primary MNOS**: Globe, Smart, DITO
- **Expandable**: Additional MNOS can be added
- **Individual Status**: Each MNOS shows independent status and countdown

### 4. Summary Dashboard
- **Quick Stats**: Total blocked, pending, overdue counts
- **Visual Indicators**: Progress bars or charts for overall status
- **Last Updated**: Timestamp of most recent data refresh

## API Integration

### Site24x7 Integration
```javascript
// Pseudo-code for Site24x7 API integration
async function checkDomainStatus(domain, mnos) {
  const results = {};
  for (const mnos of mnos) {
    const response = await site24x7API.checkUptime(domain, mnos.location);
    results[mnos.name] = response.isAccessible ? 'accessible' : 'blocked';
  }
  return results;
}
```

### Backend API Endpoints
```
GET /api/domains - Get all domain data with current status
GET /api/domains/stats - Get summary statistics
GET /api/domains/refresh - Trigger Site24x7 status check
POST /api/domains/import - Import updated CSV data (backend only)
```

## Implementation Timeline

### Phase 1: Core MVP (Week 1-2)
- [ ] Basic React dashboard with table view
- [ ] CSV data loading and display
- [ ] Manual status indicators
- [ ] Basic filtering and sorting

### Phase 2: Real-time Features (Week 3)
- [ ] Site24x7 API integration
- [ ] Countdown timer implementation
- [ ] Auto-refresh functionality
- [ ] Status color coding

### Phase 3: Polish & Deploy (Week 4)
- [ ] Responsive design
- [ ] Performance optimization
- [ ] Cloud deployment
- [ ] Public access testing

## Technical Considerations

### Performance
- **Caching**: Cache Site24x7 API responses for 5 minutes
- **Pagination**: Implement virtual scrolling for large datasets
- **Lazy Loading**: Load data progressively

### Security
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Sanitize all inputs
- **CORS**: Proper cross-origin configuration

### Scalability
- **CSV Optimization**: Consider database migration if data grows large
- **API Limits**: Monitor Site24x7 API usage
- **CDN**: Use CDN for static assets

### Mobile Responsiveness
- **Responsive Design**: Implement mobile-first approach using CSS flexbox/grid and media queries
- **Adaptive Layout**: 
  - Single column layout for small screens (< 768px)
  - Two-column layout for medium screens (768px - 1024px)
  - Full desktop layout for large screens (> 1024px)
- **Touch-Friendly UI**:
  - Minimum touch target size of 44px × 44px
  - Swipe gestures for table navigation
  - Collapsible filters section
- **Optimized Tables**:
  - Horizontal scrolling for tables on small screens
  - Priority columns always visible (Domain, Status)
  - Secondary columns accessible via swipe or expand
- **Performance Optimizations**:
  - Reduced image sizes for mobile
  - Lazy loading components
  - Minimal network requests

```
┌─────────────────────────┐
│ MNOS Blacklist Monitor  │
│                         │
│ [🔍] [📊] [🔄]         │
└─────────────────────────┘

┌─────────────────────────┐
│ Filters ▼               │
└─────────────────────────┘

┌─────────────────────────┐
│     Status Summary      │
│  🟢 245  🔴 58  ⏱️ 12  │
└─────────────────────────┘

┌─────────────────────────┐
│ Domain    │Status│ More │
├───────────┼──────┼──────┤
│example.com│ 🟢🔴🟢│  >   │
│badsite.ph │ 🔴🟢🔴│  >   │
│scam.net   │ 🟢🟢🟢│  >   │
└─────────────────────────┘
```

## CSV Import Process (Backend)

### Import Workflow
1. Admin uploads new CSV with updated submission data
2. System validates CSV format and data
3. Merges new data with existing records
4. Triggers Site24x7 status check for new submissions
5. Updates dashboard display

### CSV Import Format
```csv
action,domain,website_name,category,mnos,submitted_timestamp
add,newdomain.com,New Domain,Gambling,"globe,smart",2025-05-29T10:00:00Z
update,existing.com,Updated Site,Fraud,dito,2025-05-29T11:00:00Z
```

## Success Metrics
- **Response Time**: Dashboard loads in under 3 seconds
- **Accuracy**: 99%+ accuracy in blocking status detection
- **Uptime**: 99.9% dashboard availability
- **User Experience**: Intuitive filtering and clear status indicators

---

*This wireframe serves as the foundation for the MNOS blacklist monitoring dashboard MVP. Each component can be refined based on user feedback and technical constraints during development.*