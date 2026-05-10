import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  return (
    <div className="pagination" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5rem',
      margin: '2rem 0',
      flexWrap: 'wrap'
    }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-sm btn-secondary"
        style={{ minWidth: 'auto', padding: '0.5rem' }}
      >
        <FaChevronLeft />
      </button>

      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
          style={{ minWidth: '40px', padding: '0.5rem' }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-sm btn-secondary"
        style={{ minWidth: 'auto', padding: '0.5rem' }}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
