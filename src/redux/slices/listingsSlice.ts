import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { listingService } from '../../services/listingService';
import type { Listing, SearchFilters } from '../../types/listing.types';

interface ListingsState {
  listings: Listing[];
  currentListing: Listing | null;
  isLoading: boolean;
  error: string | null;
  filters: SearchFilters;
}

const initialState: ListingsState = {
  listings: [],
  currentListing: null,
  isLoading: false,
  error: null,
  filters: {},
};

export const fetchListings = createAsyncThunk(
  'listings/fetchListings',
  async (filters?: SearchFilters) => {
    const response = await listingService.getListings(filters);
    return response;
  }
);

export const fetchListingById = createAsyncThunk(
  'listings/fetchListingById',
  async (id: string) => {
    const response = await listingService.getListingById(id);
    return response;
  }
);

const listingsSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.listings = action.payload;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch listings';
      })
      .addCase(fetchListingById.fulfilled, (state, action) => {
        state.currentListing = action.payload;
      });
  },
});

export const { setFilters, clearFilters } = listingsSlice.actions;
export default listingsSlice.reducer;