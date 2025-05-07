import { fetchCustomers } from '../slices/customersSlice';
import { fetchProducts } from '../slices/productsSlice';
import { fetchStores } from '../slices/storesSlice';

export const fetchAllOptions = () => async (dispatch) => {
  console.log('Starting to fetch all options...');
  try {
    const results = await Promise.all([
      dispatch(fetchCustomers()),
      dispatch(fetchProducts()),
      dispatch(fetchStores())
    ]);
    console.log('Successfully fetched all options:', {
      customers: results[0],
      products: results[1],
      stores: results[2]
    });
    return results;
  } catch (error) {
    console.error('Failed to fetch options:', error);
    throw error;
  }
};
