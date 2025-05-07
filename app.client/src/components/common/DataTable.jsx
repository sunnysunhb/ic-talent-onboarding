import React from 'react';
import PropTypes from 'prop-types';

function DataTable({ 
  data, 
  columns,
  onEdit,
  onDelete
}) {
  return (
    <table className="customer-table">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.header}>{col.header}</th>
          ))}
          <th>Actions</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.Id || item.id}>
            {columns.map(col => (
              <td key={`${item.Id}_${col.accessor}`}>
                {item[col.accessor]}
              </td>
            ))}
            <td>
              <button 
                className="btn-edit"
                onClick={() => onEdit(item)}
              >
                <i className="fas fa-pencil-alt"></i> EDIT
              </button>
            </td>
            <td>
              <button 
                className="btn-delete"
                onClick={() => onDelete(item)}
              >
                <i className="fas fa-trash-alt"></i> DELETE
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default DataTable;
