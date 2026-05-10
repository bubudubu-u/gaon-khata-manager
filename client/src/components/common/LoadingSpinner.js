import React from 'react';
import { ClipLoader } from 'react-spinners';

const LoadingSpinner = ({ size = 50, color = '#1a472a', text = 'लोड हो रहा है...' }) => {
  return (
    <div className="spinner-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      gap: '1rem'
    }}>
      <ClipLoader color={color} size={size} />
      <p style={{ color: '#1a472a', fontWeight: 500, fontSize: '16px' }}>{text}</p>
    </div>
  );
};

export const LoadingScreen = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #f0f4f1 0%, #e8f0e9 100%)',
      gap: '1.5rem'
    }}>
      <div style={{ fontSize: '48px' }}>🌾</div>
      <ClipLoader color="#1a472a" size={60} />
      <h2 style={{ color: '#1a472a', fontWeight: 600 }}>Gaon Khata Manager</h2>
      <p style={{ color: '#4a5568' }}>लोड हो रहा है...</p>
    </div>
  );
};

export default LoadingSpinner;
