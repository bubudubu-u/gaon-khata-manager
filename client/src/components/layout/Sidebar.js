import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaHome, FaUsers, FaFileInvoiceDollar, FaChartBar,
  FaCog, FaSignOutAlt, FaTimes, FaLeaf
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'डैशबोर्ड' },
    { path: '/persons', icon: <FaUsers />, label: 'लोग' },
    { path: '/khata', icon: <FaFileInvoiceDollar />, label: 'हिसाब' },
    { path: '/reports', icon: <FaChartBar />, label: 'रिपोर्ट' },
  ];

  const bottomItems = [
    { path: '/settings', icon: <FaCog />, label: 'सेटिंग्स' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Close button for mobile */}
      <button 
        onClick={onClose}
        className="sidebar-close"
        style={{
          display: 'none',
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer'
        }}
      >
        <FaTimes />
      </button>

      <div className="sidebar-header">
        <NavLink to="/dashboard" className="sidebar-logo">
          <FaLeaf />
          <span>Gaon Khata</span>
        </NavLink>
        {user && (
          <p style={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: '0.875rem',
            marginTop: '0.5rem'
          }}>
            {user.village || 'गाँव'}
          </p>
        )}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={onClose}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer" style={{
        marginTop: 'auto',
        padding: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
        
        <button 
          onClick={logout}
          className="nav-item"
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.6)'
          }}
        >
          <FaSignOutAlt />
          <span>लॉगआउट</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
