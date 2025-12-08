import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SearchFilters } from '../../types/listing.types';
import type { Listing } from '../../types/listing.types';

interface SearchState {
  filters: SearchFilters;
  results: Listing[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  filters: {
    query: '',
    location: '',
    university: '',
    minPrice: 0,
    maxPrice: 500000,
    roomType: [],
  },
  results: [],
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.query = action.payload;
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.filters.location = action.payload;
    },
    setUniversity: (state, action: PayloadAction<string>) => {
      state.filters.university = action.payload;
    },
    setFilters: (state, action: PayloadAction<SearchFilters>) => {
      state.filters = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<{ minPrice: number; maxPrice: number }>) => {
      state.filters.minPrice = action.payload.minPrice;
      state.filters.maxPrice = action.payload.maxPrice;
    },
    setRoomTypes: (state, action: PayloadAction<string[]>) => {
      state.filters.roomType = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<Listing[]>) => {
      state.results = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.results = [];
      state.error = null;
    },
  },
});

export const {
  setSearchQuery,
  setLocation,
  setUniversity,
  setFilters,
  setPriceRange,
  setRoomTypes,
  setSearchResults,
  setLoading,
  setError,
  clearFilters,
} = searchSlice.actions;

export default searchSlice.reducer;