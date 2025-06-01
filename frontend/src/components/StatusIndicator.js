import React from 'react';
import '../styles/StatusIndicator.css';

const StatusIndicator = ({ status, timeRemaining, tooltipText }) => {
  let icon, statusClass;
  
  switch (status) {
    case 'blocked':
      icon = <span role="img" aria-label="blocked">🟢</span>;
      statusClass = 'status-blocked';
      break;
    case 'pending':
      icon = <span role="img" aria-label="pending">🔴</span>;
      statusClass = 'status-pending';
      break;
    case 'overdue':
      icon = <span role="img" aria-label="overdue">⚠️</span>;
      statusClass = 'status-overdue';
      break;
    default:
      return <span className="status-unknown">-</span>;
  }
  
  return (
    <div className={`status-indicator ${statusClass}`} title={tooltipText || status}>
      <span className="icon">{icon}</span>
      {timeRemaining && <span className="countdown">{timeRemaining}</span>}
      {status === 'overdue' && <span className="overdue-text">overdue</span>}
      {status === 'pending' && <span className="pending-text">pending</span>}
    </div>
  );
};

export default StatusIndicator;