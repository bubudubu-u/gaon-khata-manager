import React from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen } from 'react-icons/fa';

const EmptyState = ({ 
  icon = <FaBoxOpen />,
  title = 'कोई डेटा नहीं',
  message = 'अभी तक कोई डेटा नहीं जोड़ा गया है',
  actionText = 'नया जोड़ें',
  actionLink = null,
  onAction = null
}) => {
  return (
    <div className="empty-state" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '64px', color: '#a0aec0', marginBottom: '1.5rem' }}>
        {icon}
      </div>
      
      <h3 style={{ 
        fontSize: '1.25rem', 
        fontWeight: 600, 
        color: '#4a5568',
        marginBottom: '0.5rem'
      }}>
        {title}
      </h3>
      
      <p style={{ 
        color: '#718096', 
        marginBottom: '1.5rem',
        maxWidth: '400px'
      }}>
        {message}
      </p>

      {actionLink ? (
        <Link to={actionLink} className="btn btn-primary">
          {actionText}
        </Link>
      ) : onAction ? (
        <button onClick={onAction} className="btn btn-primary">
          {actionText}
        </button>
      ) : null}
    </div>
  );
};

export default EmptyState;
