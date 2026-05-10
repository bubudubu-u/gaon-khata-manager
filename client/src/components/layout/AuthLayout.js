import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a472a 0%, #2d6a4f 50%, #40916c 100%)',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background circles */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        animation: 'pulse 4s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        left: '-50px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.03)',
        animation: 'pulse 5s ease-in-out infinite'
      }} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: '440px',
          zIndex: 1
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '64px', marginBottom: '1rem' }}>🌾</div>
          <h1 style={{ 
            color: 'white', 
            fontSize: '2rem', 
            fontWeight: 700,
            marginBottom: '0.5rem'
          }}>
            Gaon Khata Manager
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>
            गाँव खाता मैनेजर
          </p>
        </div>

        <Outlet />
      </motion.div>
    </div>
  );
};

export default AuthLayout;
