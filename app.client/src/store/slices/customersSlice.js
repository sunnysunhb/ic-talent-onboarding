import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCustomers } from '../../services/customerApi';

export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async () => {
    const response = await getCustomers();
    return response;
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState: {
    list: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default customersSlice.reducer;
