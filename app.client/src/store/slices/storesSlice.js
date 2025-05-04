import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStores } from '../../services/storeApi';

export const fetchStores = createAsyncThunk(
  'stores/fetchAll',
  async () => {
    const response = await getStores();
    return response;
  }
);

const storesSlice = createSlice({
  name: 'stores',
  initialState: {
    list: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default storesSlice.reducer;
