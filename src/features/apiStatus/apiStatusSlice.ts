import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';

interface IApiStatusState {
  /** A request could not reach the backend at all; the layout shows the outage screen. */
  unavailable: boolean;
}

const initialState: IApiStatusState = { unavailable: false };

const apiStatusSlice = createSlice({
  name: 'apiStatus',
  initialState,
  reducers: {
    markApiUnavailable(state) {
      state.unavailable = true;
    },
  },
});

export const { markApiUnavailable } = apiStatusSlice.actions;
export const apiStatusReducer = apiStatusSlice.reducer;

export const selectApiUnavailable = (s: RootState): boolean => s.apiStatus.unavailable;
