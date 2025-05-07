import React, { useMemo, useCallback } from 'react';
import { getStores, deleteStore, createStore, updateStore } from '../services/storeApi';
import AddDialog from '../components/common/AddDialog';
import EditDialog from '../components/common/EditDialog';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

const useStoresConfig = () => {
  const updateHandler = useCallback((id, data) => updateStore(id, {
    id,
    Name: data.Name,
    Address: data.Address
  }), []);

  const columns = useMemo(() => [
    { 
      header: 'Name', 
      accessor: 'Name',
      width: 200,
      cellClassName: 'stores-table-cell'
    },
    { 
      header: 'Address', 
      accessor: 'Address',
      width: 300,
      cellClassName: 'stores-table-cell'
    }
  ], []);

const dialogComponents = useMemo(() => ({
    add: React.memo((props) => <AddDialog
      title="Add New Store"
      fields={[
        { 
          name: 'Name',
          label: 'Store Name',
          type: 'text',
          required: true
        },
        { 
          name: 'Address',
          label: 'Address',
          type: 'text',
          required: true
        }
      ]}
      apiMethod={createStore}
      {...props}
    />),
    edit: React.memo((props) => <EditDialog
      title="Edit Store"
      fields={[
        { 
          name: 'Name',
          label: 'Store Name',
          type: 'text',
          required: true
        },
        { 
          name: 'Address',
          label: 'Address',
          type: 'text',
          required: true
        }
      ]}
      apiMethod={updateHandler}
      {...props}
    />),
    delete: React.memo(DeleteConfirmDialog)
  }), [updateHandler, createStore]);

  return useMemo(() => ({
    apiService: {
      fetch: getStores,
      delete: deleteStore
    },
    columns,
    dialogComponents,
    pageTitle: 'Stores Management',
    deleteItemName: 'Store',
    newButtonText: 'New Store',
    showTitle: false
  }), [columns, dialogComponents]);
};

export default useStoresConfig;
