import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { formatCurrency, formatDate, getEntryTypeLabel, getStatusLabel, getStatusColor } from '../../utils/formatters';

const KhataTable = ({ entries, onDelete, onPageChange, currentPage, totalPages }) => {
  if (!entries || entries.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
        <p style={{ fontSize: '1.125rem' }}>कोई प्रविष्टि नहीं मिली</p>
      </div>
    );
  }

  return (
    <div className="table-container glass-card">
      <div style={{ overflowX: 'auto' }}>
        <table className="khata-table">
          <thead>
            <tr>
              <th>दिनांक</th>
              <th>व्यक्ति</th>
              <th>गाँव</th>
              <th>प्रकार</th>
              <th>कुल राशि</th>
              <th>भुगतान</th>
              <th>बकाया</th>
              <th>स्थिति</th>
              <th>कार्रवाई</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <motion.tr
                key={entry._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                style={{
                  background: entry.financials.remainingAmount > 0 
                    ? 'rgba(254, 215, 215, 0.1)' 
                    : entry.status === 'completed' 
                      ? 'rgba(198, 246, 213, 0.1)' 
                      : 'transparent'
                }}
              >
                <td style={{ whiteSpace: 'nowrap', fontSize: '0.875rem' }}>
                  {formatDate(entry.date)}
                </td>
                <td>
                  <Link to={`/persons/${entry.person?._id}`} style={{
                    color: '#1a472a', fontWeight: 600, textDecoration: 'none',
                    fontSize: '0.9375rem'
                  }}>
                    {entry.person?.name || 'N/A'}
                  </Link>
                  <br />
                  <small style={{ color: '#718096', fontSize: '0.75rem' }}>
                    {entry.person?.fatherName}
                  </small>
                </td>
                <td style={{ fontSize: '0.8125rem', color: '#718096' }}>
                  {entry.person?.village || '-'}
                </td>
                <td>
                  <span className={`badge badge-${
                    entry.entryType === 'charha' ? 'info' :
                    entry.entryType === 'batai' ? 'success' :
                    entry.entryType === 'patta' ? 'warning' :
                    entry.entryType === 'bakaya' ? 'danger' : 'info'
                  }`}>
                    {getEntryTypeLabel(entry.entryType)}
                  </span>
                </td>
                <td style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                  {formatCurrency(entry.financials.totalAmount)}
                </td>
                <td style={{ color: '#48bb78', fontWeight: 500 }}>
                  {formatCurrency(entry.financials.paidAmount)}
                </td>
                <td style={{
                  color: entry.financials.remainingAmount > 0 ? '#e53e3e' : '#48bb78',
                  fontWeight: 700, fontSize: '0.9375rem'
                }}>
                  {formatCurrency(entry.financials.remainingAmount)}
                </td>
                <td>
                  <span className={`badge badge-${getStatusColor(entry.status)}`}>
                    {getStatusLabel(entry.status)}
                  </span>
                </td>
                <td>
                  <div className="action-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/khata/${entry._id}`} className="btn-icon" title="देखें"
                      style={{ color: '#4299e1', fontSize: '1rem', textDecoration: 'none' }}>
                      <FaEye />
                    </Link>
                    <Link to={`/khata/${entry._id}/edit`} className="btn-icon" title="संपादित करें"
                      style={{ color: '#ed8936', fontSize: '1rem', textDecoration: 'none' }}>
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => onDelete(entry._id)}
                      className="btn-icon danger" title="हटाएं"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53e3e', fontSize: '1rem' }}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KhataTable;
