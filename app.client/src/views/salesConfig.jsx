import React from 'react';
import { getSales, deleteSale, createSale, updateSale } from '../services/salesApi';
import EnhancedAddDialog from '../components/EnhancedAddDialog';
import EnhancedEditDialog from '../components/EnhancedEditDialog'; 
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

export default {
  apiService: {
    fetch: getSales,
    delete: deleteSale
  },
  columns: [
    { 
      header: 'Customer', 
      accessor: 'CustomerName',
      width: 200
    },
    {
      header: 'Product',
      accessor: 'ProductName', 
      width: 200
    },
    {
      header: 'Store',
      accessor: 'StoreName',
      width: 200
    },
    {
      header: 'Date Sold',
      accessor: 'DateSold',
      width: 150
    }
  ],
  dialogComponents: {
    add: (props) => <EnhancedAddDialog
      title="Add New Sale"
      apiMethod={createSale}
      {...props}
    />,
    edit: (props) => <EnhancedEditDialog
      title="Edit Sale"
      apiMethod={updateSale}
      {...props}
    />,
    delete: DeleteConfirmDialog
  },
  pageTitle: 'Sales Management',
  deleteItemName: 'Sale',
  newButtonText: 'New Sale',
  showTitle: false
}
