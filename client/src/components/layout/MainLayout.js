import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion } from 'framer-motion';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="main-content" style={{
        flex: 1,
        marginLeft: '280px',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f4f1 0%, #e8f0e9 100%)',
        transition: 'margin-left 0.3s ease'
      }}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            padding: '2rem',
            maxWidth: '1400px',
            margin: '0 auto'
          }}
        >
          <Outlet />
        </motion.main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 90,
            display: window.innerWidth <= 768 ? 'block' : 'none'
          }}
        />
      )}
    </div>
  );
};

export default MainLayout;
