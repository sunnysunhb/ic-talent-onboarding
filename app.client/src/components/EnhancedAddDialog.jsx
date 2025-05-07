import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddDialog from './common/AddDialog';
import { fetchAllOptions } from '../store/thunks/apiThunks';

export default function EnhancedAddDialog({ apiMethod, ...props }) {
  const dispatch = useDispatch();
  const customers = useSelector(state => state.customers?.list || []);
  const products = useSelector(state => state.products?.list || []);
  const stores = useSelector(state => state.stores?.list || []);
  const loadingOptions = useSelector(state => {
    console.log('Current loading states:', {
      customers: state.customers.status,
      products: state.products.status,
      stores: state.stores.status
    });
    return (
      state.customers.status === 'loading' || 
      state.products.status === 'loading' || 
      state.stores.status === 'loading'
    );
  });

  useEffect(() => {
    dispatch(fetchAllOptions());
  }, [dispatch]);

  const enhancedFields = [
    { 
      name: 'CustomerId',
      label: 'Customer',
      type: 'select',
      options: customers.map(c => ({ value: c.Id, label: `${c.Name} (ID: ${c.Id})` })),
      required: true
    },
    {
      name: 'ProductId',
      label: 'Product', 
      type: 'select',
      options: products.map(p => ({ value: p.Id, label: `${p.Name} (ID: ${p.Id})` })),
      required: true
    },
    {
      name: 'StoreId',
      label: 'Store',
      type: 'select',
      options: stores.map(s => ({ value: s.Id, label: `${s.Name} (ID: ${s.Id})` })),
      required: true
    },
    {
      name: 'DateSold',
      label: 'Date Sold',
      type: 'date',
      required: true,
      defaultValue: new Date().toISOString().split('T')[0],
      inputProps: {
        showMonthDropdown: true,
        showYearDropdown: true,
        dropdownMode: "select"
      }
    }
  ];

  return (
    <AddDialog
      {...props}
      fields={enhancedFields}
      apiMethod={apiMethod}
      loading={loadingOptions}
    />
  );
}
