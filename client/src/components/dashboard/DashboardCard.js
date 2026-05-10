import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DashboardCard = ({ 
  icon, 
  iconBg, 
  title, 
  value, 
  subtitle,
  link, 
  linkText,
  color = '#1a472a'
}) => {
  return (
    <motion.div 
      className="dashboard-card"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="card-icon" style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="card-value" style={{ color }}>{value}</div>
      <div className="card-title hindi-text">{title}</div>
      {subtitle && (
        <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.25rem' }}>
          {subtitle}
        </div>
      )}
      {link && (
        <Link 
          to={link}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginTop: '0.75rem',
            fontSize: '0.8125rem',
            color: color,
            textDecoration: 'none',
            fontWeight: 500
          }}
        >
          {linkText} →
        </Link>
      )}
    </motion.div>
  );
};

export default DashboardCard;
