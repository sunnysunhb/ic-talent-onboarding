import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EditDialog from './common/EditDialog';
import { fetchAllOptions } from '../store/thunks/apiThunks';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function EnhancedEditDialog({ item, apiMethod, ...props }) {
  const dispatch = useDispatch();
  const customers = useSelector(state => state.customers?.list || []);
  const products = useSelector(state => state.products?.list || []);
  const stores = useSelector(state => state.stores?.list || []);
  const loadingOptions = useSelector(state => (
    state.customers?.status === 'loading' || 
    state.products?.status === 'loading' || 
    state.stores?.status === 'loading'
  ));
  const error = useSelector(state => (
    state.customers?.error || 
    state.products?.error || 
    state.stores?.error
  ));

  useEffect(() => {
    dispatch(fetchAllOptions());
  }, [dispatch]);

  const enhancedFields = [
    { 
      name: 'CustomerId',
      label: 'Customer',
      type: 'select',
      options: customers?.length > 0 ? 
        customers.map(c => ({ 
          value: c.Id || c.id, 
          label: `${c.Name || c.name} (ID: ${c.Id || c.id})`
        })) : [],
      required: true
    },
    {
      name: 'ProductId',
      label: 'Product', 
      type: 'select',
      options: products?.length > 0 ?
        products.map(p => ({ 
          value: p.Id || p.id, 
          label: `${p.Name || p.name} (ID: ${p.Id || p.id})`
        })) : [],
      required: true
    },
    {
      name: 'StoreId',
      label: 'Store',
      type: 'select',
      options: stores?.length > 0 ?
        stores.map(s => ({ 
          value: s.Id || s.id, 
          label: `${s.Name || s.name} (ID: ${s.Id || s.id})`
        })) : [],
      required: true
    },
    {
      name: 'DateSold',
      label: 'Date Sold',
      type: 'date',
      required: true,
      inputProps: {
        showMonthDropdown: true,
        showYearDropdown: true,
        dropdownMode: "select",
        locale: "en"
      }
    }
  ];

  // Optimize fields configuration with React.memo
  const memoizedFields = useMemo(() => enhancedFields, [customers, products, stores]);
  
  console.log('Rendering with:', {
    item: JSON.parse(JSON.stringify(item)), // Deep clone to avoid proxy objects
    customers: customers?.length,
    products: products?.length,
    stores: stores?.length,
    loadingOptions,
    memoizedFields: memoizedFields.map(f => ({
      ...f,
      options: f.options?.length
    }))
  });

  // Only render after data is fully loaded
  if (loadingOptions) {
    return <div>Loading options...</div>;
  }

  return (
    <EditDialog
      {...props}
      item={{
        ...item,
        // Standardize ID field format
        CustomerId: String(item?.CustomerId || item?.customerId || ''),
        ProductId: String(item?.ProductId || item?.productId || ''),
        StoreId: String(item?.StoreId || item?.storeId || '')
      }}
      fields={memoizedFields}
      apiMethod={apiMethod}
      loading={false} // Data loading completed
    />
  );
}
