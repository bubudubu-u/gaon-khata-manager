import React from 'react';

const MonthlyChart = ({ data }) => {
  const months = ['जन', 'फर', 'मार्च', 'अप्रैल', 'मई', 'जून', 
                  'जुला', 'अग', 'सित', 'अक्टू', 'नव', 'दिस'];
  
  const maxAmount = Math.max(...data.map(d => d.totalAmount || 0), 1);

  return (
    <div style={{ padding: '1rem 0' }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        height: '200px',
        gap: '0.25rem'
      }}>
        {months.map((month, index) => {
          const monthData = data.find(d => d._id === index + 1) || {};
          const height = ((monthData.totalAmount || 0) / maxAmount) * 100;
          
          return (
            <div key={month} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1
            }}>
              <div style={{
                width: '100%',
                maxWidth: '40px',
                height: `${Math.max(height, 2)}%`,
                background: height > 0 
                  ? 'linear-gradient(180deg, #48bb78, #38a169)' 
                  : '#edf2f7',
                borderRadius: '4px 4px 0 0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative'
              }}
              title={`${month}: ₹${(monthData.totalAmount || 0).toLocaleString()}`}
              >
                {height > 10 && (
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: '#2d3748',
                    whiteSpace: 'nowrap'
                  }}>
                    ₹{(monthData.totalAmount || 0) >= 1000 
                      ? `${((monthData.totalAmount || 0)/1000).toFixed(1)}K` 
                      : monthData.totalAmount}
                  </div>
                )}
              </div>
              <span style={{
                fontSize: '0.75rem',
                color: '#718096',
                marginTop: '0.5rem'
              }}>
                {month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyChart;
