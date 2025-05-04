import { configureStore } from '@reduxjs/toolkit';
import customersReducer from './slices/customersSlice';
import productsReducer from './slices/productsSlice';
import storesReducer from './slices/storesSlice';

export default configureStore({
  reducer: {
    customers: customersReducer,
    products: productsReducer,
    stores: storesReducer
  }
});
