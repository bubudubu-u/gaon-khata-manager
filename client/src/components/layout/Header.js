import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaBell, FaUserCircle, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header style={{
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(10px)',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={onMenuClick}
          className="menu-btn"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: '#1a472a',
            cursor: 'pointer'
          }}
        >
          <FaBars />
        </button>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 600,
          color: '#1a472a',
          margin: 0
        }}>
          {user?.name || 'नमस्ते'}
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Search */}
        <div className="header-search" style={{
          display: 'flex',
          alignItems: 'center',
          background: '#f0f4f1',
          borderRadius: '8px',
          padding: '0.5rem 1rem',
          gap: '0.5rem'
        }}>
          <FaSearch style={{ color: '#718096' }} />
          <input 
            type="text" 
            placeholder="खोजें..."
            style={{
              border: 'none',
              background: 'none',
              outline: 'none',
              fontSize: '0.875rem',
              width: '150px'
            }}
          />
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              color: '#4a5568',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <FaBell />
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: '#e53e3e',
              color: 'white',
              fontSize: '0.625rem',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              3
            </span>
          </button>
          
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              width: '320px',
              maxHeight: '400px',
              overflow: 'auto',
              zIndex: 100,
              marginTop: '0.5rem'
            }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid #edf2f7' }}>
                <h4 style={{ margin: 0, fontSize: '0.9375rem' }}>सूचनाएं</h4>
              </div>
              <div style={{ padding: '1rem' }}>
                <p style={{ color: '#718096', fontSize: '0.875rem' }}>
                  कोई नई सूचना नहीं
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <Link 
          to="/profile" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            color: '#2d3748',
            padding: '0.25rem 0.5rem',
            borderRadius: '8px',
            transition: 'background 0.3s'
          }}
        >
          <FaUserCircle style={{ fontSize: '2rem', color: '#1a472a' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {user?.name?.split(' ')[0]}
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
