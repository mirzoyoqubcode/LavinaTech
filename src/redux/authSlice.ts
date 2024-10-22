import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  key: string | null;
  secret: string | null;
}

const initialState: AuthState = {
  key: null,
  secret: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ key: string; secret: string }>
    ) {
      state.key = action.payload.key;
      state.secret = action.payload.secret;
    },
    clearCredentials(state) {
      state.key = null;
      state.secret = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
