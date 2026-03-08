import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnalyticsData {
  patientTrends: { month: string; patients: number }[];
  departmentStats: { department: string; count: number }[];
  dailyVisits: { day: string; visits: number }[];
}

interface AnalyticsState {
  data: AnalyticsData;
  loading: boolean;
}

const initialState: AnalyticsState = {
  data: {
    patientTrends: [],
    departmentStats: [],
    dailyVisits: [],
  },
  loading: false,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setAnalyticsData(state, action: PayloadAction<AnalyticsData>) {
      state.data = action.payload;
    },
    setAnalyticsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setAnalyticsData, setAnalyticsLoading } = analyticsSlice.actions;
export default analyticsSlice.reducer;
