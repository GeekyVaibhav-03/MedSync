import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Token {
  id: string;
  patientName: string;
  tokenNumber: number;
  department: string;
  status: 'waiting' | 'in-progress' | 'completed';
  createdAt: string;
}

interface TokenState {
  queue: Token[];
  currentToken: Token | null;
  loading: boolean;
}

const initialState: TokenState = {
  queue: [],
  currentToken: null,
  loading: false,
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setQueue(state, action: PayloadAction<Token[]>) {
      state.queue = action.payload;
    },
    addToken(state, action: PayloadAction<Token>) {
      state.queue.push(action.payload);
    },
    setCurrentToken(state, action: PayloadAction<Token | null>) {
      state.currentToken = action.payload;
    },
    updateTokenStatus(state, action: PayloadAction<{ id: string; status: Token['status'] }>) {
      const token = state.queue.find(t => t.id === action.payload.id);
      if (token) token.status = action.payload.status;
    },
    setTokenLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setQueue, addToken, setCurrentToken, updateTokenStatus, setTokenLoading } = tokenSlice.actions;
export default tokenSlice.reducer;
