import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts } from '../../services/productApi';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async () => {
    const response = await getProducts();
    return response;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default productsSlice.reducer;
