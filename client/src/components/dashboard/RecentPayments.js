import React from 'react';
import { format } from 'date-fns';
import { hi } from 'date-fns/locale';

const RecentPayments = ({ payments }) => {
  if (!payments || payments.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem',
        color: '#718096'
      }}>
        <p>हाल ही में कोई भुगतान नहीं</p>
      </div>
    );
  }

  return (
    <div className="recent-payments">
      {payments.map((payment, index) => (
        <div 
          key={payment._id || index}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem',
            borderBottom: index < payments.length - 1 ? '1px solid #edf2f7' : 'none',
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f7fafc'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div>
            <p style={{ 
              fontWeight: 500, 
              color: '#2d3748',
              margin: 0,
              fontSize: '0.9375rem'
            }}>
              {payment.person?.name || 'Unknown'}
            </p>
            <p style={{ 
              color: '#718096', 
              fontSize: '0.75rem',
              margin: '0.25rem 0 0'
            }}>
              {format(new Date(payment.date || payment.updatedAt), 'dd MMM, yyyy', { locale: hi })}
            </p>
          </div>
          <span style={{
            fontWeight: 600,
            color: '#48bb78',
            fontSize: '1.0625rem'
          }}>
            +₹{(payment.financials?.paidAmount || 0).toLocaleString('hi-IN')}
          </span>
        </div>
      ))}
    </div>
  );
};

export default RecentPayments;
