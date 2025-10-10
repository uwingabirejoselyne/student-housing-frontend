import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  query: string;
  location: string;
  results: any[];
}

const initialState: SearchState = {
  query: '',
  location: '',
  results: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    setSearchResults: (state, action) => {
      state.results = action.payload;
    },
  },
});

export const { setSearchQuery, setLocation, setSearchResults } = searchSlice.actions;
export default searchSlice.reducer;