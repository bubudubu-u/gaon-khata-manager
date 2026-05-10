import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const VillageWiseChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
        <p>कोई डेटा उपलब्ध नहीं</p>
      </div>
    );
  }

  const totalAmount = data.reduce((sum, item) => sum + (item.totalPending || item.totalAmount || 0), 0);
  const colors = ['#48bb78', '#4299e1', '#ed8936', '#9f7aea', '#f56565', '#38b2ac', '#ed64a6', '#667eea'];

  return (
    <div style={{ padding: '1rem 0' }}>
      {data.map((item, index) => {
        const amount = item.totalPending || item.totalAmount || 0;
        const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
        const color = colors[index % colors.length];

        return (
          <div key={item._id || index} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8125rem' }}>
              <span style={{ fontWeight: 500, color: '#4a5568' }}>
                {item._id || 'अज्ञात'}
                {item.count && ` (${item.count})`}
              </span>
              <span style={{ fontWeight: 600, color }}>
                {formatCurrency(amount)}
                <span style={{ fontSize: '0.6875rem', color: '#718096', marginLeft: '0.5rem' }}>
                  ({percentage.toFixed(1)}%)
                </span>
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '10px',
              background: '#edf2f7',
              borderRadius: '5px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${percentage}%`,
                height: '100%',
                background: color,
                borderRadius: '5px',
                transition: 'width 0.5s ease',
                minWidth: percentage > 0 ? '2px' : '0'
              }} />
            </div>
          </div>
        );
      })}

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: '#f0f4f1',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontWeight: 500, color: '#4a5568' }}>कुल</span>
        <span style={{ fontWeight: 700, color: '#1a472a', fontSize: '1.125rem' }}>
          {formatCurrency(totalAmount)}
        </span>
      </div>
    </div>
  );
};

export default VillageWiseChart;
