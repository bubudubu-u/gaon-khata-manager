import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaPhone, FaHome, FaEdit, FaTrash, FaEye, FaRupeeSign } from 'react-icons/fa';
import { formatCurrency, getInitials } from '../../utils/formatters';

const PersonCard = ({ person, onEdit, onDelete }) => {
  return (
    <motion.div
      className="glass-card"
      whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      whileTap={{ scale: 0.98 }}
      style={{
        padding: '1.5rem',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
        background: person.totalPending > 0 
          ? 'linear-gradient(90deg, #e53e3e, #ed8936)' 
          : 'linear-gradient(90deg, #48bb78, #38b2ac)'
      }} />

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
        {/* Avatar */}
        <div style={{
          width: '60px', height: '60px', borderRadius: '16px',
          background: person.photo 
            ? `url(${person.photo})` 
            : 'linear-gradient(135deg, #1a472a, #40916c)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0
        }}>
          {!person.photo && getInitials(person.name)}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ 
            fontSize: '1.125rem', fontWeight: 600, color: '#1a472a',
            margin: '0 0 0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {person.name}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', color: '#718096', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaUser style={{ fontSize: '0.75rem' }} />
              {person.fatherName}
            </span>
            <span style={{ fontSize: '0.8125rem', color: '#718096', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaHome style={{ fontSize: '0.75rem' }} />
              {person.village}
            </span>
            {person.mobile && (
              <span style={{ fontSize: '0.8125rem', color: '#718096', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaPhone style={{ fontSize: '0.75rem' }} />
                +91 {person.mobile}
              </span>
            )}
          </div>

          {/* Pending Amount */}
          {person.totalPending !== undefined && (
            <div style={{
              padding: '0.5rem 0.75rem',
              background: person.totalPending > 0 ? '#fff5f5' : '#f0fff4',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem'
            }}>
              <span style={{ fontSize: '0.75rem', color: '#718096' }}>बकाया</span>
              <span style={{
                fontSize: '1rem', fontWeight: 700,
                color: person.totalPending > 0 ? '#e53e3e' : '#48bb78',
                display: 'flex', alignItems: 'center', gap: '0.25rem'
              }}>
                <FaRupeeSign style={{ fontSize: '0.75rem' }} />
                {formatCurrency(person.totalPending)}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/persons/${person._id}`} className="btn btn-secondary btn-sm"
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.8125rem' }}>
              <FaEye /> देखें
            </Link>
            <Link to={`/persons/${person._id}/edit`} className="btn btn-primary btn-sm"
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.8125rem' }}>
              <FaEdit /> संपादित
            </Link>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="btn btn-danger btn-sm"
              style={{ padding: '0.5rem', fontSize: '0.8125rem', minWidth: 'auto' }}>
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonCard;
