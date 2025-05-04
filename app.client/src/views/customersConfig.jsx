import React, { useMemo, useCallback } from 'react';
import { getCustomers, deleteCustomer, createCustomer, updateCustomer } from '../services/customerApi';
import AddDialog from '../components/common/AddDialog';
import EditDialog from '../components/common/EditDialog';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

const useCustomersConfig = () => {
  // Cache API methods
  const fetchCustomers = useCallback(getCustomers, []);
  const deleteCustomerItem = useCallback(deleteCustomer, []);
  
  // Customer creation handler
  const createHandler = useCallback((data) => createCustomer({
    Name: data.Name,
    Address: data.Address
  }), []);

  // Customer update handler
  const updateHandler = useCallback((id, data) => updateCustomer(id, {
    Id: id,
    Name: data.Name,
    Address: data.Address
  }), []);

  // Table columns configuration
  const columns = useMemo(() => [
    { header: 'Name', accessor: 'Name' },
    { header: 'Address', accessor: 'Address' }
  ], []);

  // Dialog components
  const dialogComponents = useMemo(() => ({
    add: React.memo((props) => <AddDialog 
      title="Add Customer"
      fields={[
        { name: 'Name', label: 'Customer Name', type: 'text' },
        { name: 'Address', label: 'Address', type: 'text' }
      ]}
      apiMethod={createHandler}
      {...props}
    />),
    edit: React.memo((props) => <EditDialog
      title="Edit Customer"
      fields={[
        { name: 'Name', label: 'Customer Name', type: 'text' },
        { name: 'Address', label: 'Address', type: 'text' }
      ]}
      apiMethod={updateHandler}
      {...props}
    />),
    delete: React.memo(DeleteConfirmDialog)
  }), [createHandler, updateHandler]);

  return {
    apiService: {
      fetch: fetchCustomers,
      delete: deleteCustomerItem
    },
    columns,
    dialogComponents,
    pageTitle: 'Customers Management',
    deleteItemName: 'Customer',
    newButtonText: 'New Customer',
    showTitle: false
  };
};

export default useCustomersConfig;
