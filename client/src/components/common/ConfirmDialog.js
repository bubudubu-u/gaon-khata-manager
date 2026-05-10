import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'पुष्टि करें', 
  message = 'क्या आप निश्चित हैं?',
  confirmText = 'हां',
  cancelText = 'रद्द करें',
  type = 'warning' // 'warning', 'danger', 'info'
}) => {
  const colors = {
    warning: '#ed8936',
    danger: '#e53e3e',
    info: '#4299e1'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="modal-content confirm-dialog"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '420px',
              textAlign: 'center'
            }}
          >
            <div className="confirm-icon" style={{ 
              fontSize: '48px', 
              marginBottom: '1rem',
              color: colors[type]
            }}>
              <FaExclamationTriangle />
            </div>
            
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 600,
              marginBottom: '0.75rem',
              color: '#2d3748'
            }}>
              {title}
            </h3>
            
            <p style={{ 
              color: '#718096', 
              marginBottom: '1.5rem',
              lineHeight: 1.6
            }}>
              {message}
            </p>

            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center' 
            }}>
              <button 
                onClick={onClose} 
                className="btn btn-secondary"
                style={{ minWidth: '120px' }}
              >
                {cancelText}
              </button>
              <button 
                onClick={onConfirm} 
                className={`btn btn-${type === 'danger' ? 'danger' : 'primary'}`}
                style={{ minWidth: '120px' }}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
