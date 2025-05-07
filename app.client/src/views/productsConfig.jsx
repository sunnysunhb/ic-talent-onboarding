import React, { useMemo, useCallback } from 'react';
import { getProducts, deleteProduct, createProduct, updateProduct } from '../services/productApi';
import AddDialog from '../components/common/AddDialog';
import EditDialog from '../components/common/EditDialog';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

const useProductsConfig = () => {
  // Cache API methods
  const fetchProducts = useCallback(getProducts, []);
  const deleteProductItem = useCallback(deleteProduct, []);
  
  // Product creation handler
  const createHandler = useCallback((data) => createProduct({
    ...data,
    Price: Number(data.Price)
  }), []);

  // Product update handler
  const updateHandler = useCallback((id, data) => updateProduct(id, {
    id: id,
    Name: data.Name,
    Price: Number(data.Price)
  }), []);

  // Table columns configuration
  const columns = useMemo(() => [
    { header: 'Name', accessor: 'Name' },
    { 
      header: 'Price', 
      accessor: 'Price',
      cell: value => `$${value?.toFixed(2)}`
    }
  ], []);

  // Dialog components
  const dialogComponents = useMemo(() => ({
    add: React.memo((props) => <AddDialog 
      title="Add Product"
      fields={[
        { name: 'Name', label: 'Product Name', type: 'text' },
        { name: 'Price', label: 'Price', type: 'number' }
      ]}
      apiMethod={createHandler}
      {...props}
    />),
    edit: React.memo((props) => <EditDialog
      title="Edit Product"
      fields={[
        { name: 'Name', label: 'Product Name', type: 'text' },
        { name: 'Price', label: 'Price', type: 'number' }
      ]}
      apiMethod={updateHandler}
      {...props}
    />),
    delete: React.memo(DeleteConfirmDialog)
  }), [createHandler, updateHandler]);

  return {
    apiService: {
      fetch: fetchProducts,
      delete: deleteProductItem
    },
    columns,
    dialogComponents,
    pageTitle: 'Products Management',
    deleteItemName: 'Product',
    newButtonText: 'New Product',
    showTitle: false
  };
};

export default useProductsConfig;
