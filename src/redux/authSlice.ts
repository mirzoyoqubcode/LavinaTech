import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  key: string | null;
  secret: string | null;
}

const loadCredentials = (): AuthState => {
  const key = localStorage.getItem("authKey");
  const secret = localStorage.getItem("authSecret");
  return {
    key: key ? key : null,
    secret: secret ? secret : null,
  };
};

const initialState: AuthState = loadCredentials();

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
      localStorage.setItem("authKey", action.payload.key);
      localStorage.setItem("authSecret", action.payload.secret);
    },
    clearCredentials(state) {
      state.key = null;
      state.secret = null;
      localStorage.removeItem("authKey");
      localStorage.removeItem("authSecret");
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
