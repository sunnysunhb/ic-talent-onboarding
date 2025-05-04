import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useDataFetching from '../../hooks/useDataFetching';
import DataTable from './DataTable';
import Pagination from './Pagination';

function GenericCrudPage(props) {
  const config = props.config || props;
  const {
    apiService,
    columns,
    dialogComponents,
    pageTitle
  } = config;
  const { data, loading, error, refreshData } = useDataFetching(apiService.fetch);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogState, setDialogState] = useState({
    add: false,
    edit: false,
    delete: false
  });

  // Calculate pagination data
  const totalPages = Math.ceil((data?.length || 0) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data?.slice(startIndex, startIndex + pageSize) || [];

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="crud-container">
      {config.showTitle !== false && <h2>{pageTitle}</h2>}
      
      <button 
        className="btn-new"
        onClick={() => setDialogState({...dialogState, add: true})}
      >
        {config.newButtonText || `New ${pageTitle}`}
      </button>

      <DataTable
        data={paginatedData}
        columns={columns}
        onEdit={(item) => {
          console.log('Edit button clicked for item:', item); // Debug log
          setSelectedItem(item);
          setDialogState({...dialogState, edit: true});
        }}
        onDelete={(item) => {
          setSelectedItem(item);
          setDialogState({...dialogState, delete: true});
        }}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {dialogComponents.add && (
        <dialogComponents.add
          open={dialogState.add}
          onClose={() => setDialogState({...dialogState, add: false})}
          onSuccess={refreshData}
        />
      )}

      {dialogComponents.edit && (
        <dialogComponents.edit
          open={dialogState.edit}
          item={selectedItem}
          onClose={() => setDialogState({...dialogState, edit: false})}
          onSuccess={refreshData}
        />
      )}

      {dialogComponents.delete && (
        <dialogComponents.delete
          open={dialogState.delete}
          item={selectedItem}
          itemName={config.deleteItemName || pageTitle.replace('Management', '').trim()}
          deleteFunction={apiService.delete}
          onClose={() => setDialogState({...dialogState, delete: false})}
          onSuccess={refreshData}
        />
      )}
    </div>
  );
}

GenericCrudPage.propTypes = {
  apiService: PropTypes.shape({
    fetch: PropTypes.func.isRequired,
    delete: PropTypes.func
  }).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired
    })
  ).isRequired,
  dialogComponents: PropTypes.shape({
    add: PropTypes.elementType,
    edit: PropTypes.elementType,
    delete: PropTypes.elementType
  }),
  pageTitle: PropTypes.string.isRequired
};

export default GenericCrudPage;
