import React from 'react';
import PropTypes from 'prop-types';

function Pagination({ 
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange
}) {
  return (
    <div className="pagination-container">
      <div className="page-size-selector">
        <select 
          className="page-size-select" 
          value={pageSize}
          onChange={onPageSizeChange}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
      <div className="page-navigator">
        <button 
          className="page-btn" 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          {'\u2039'}
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button 
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          {'\u203A'}
        </button>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired
};

export default Pagination;
