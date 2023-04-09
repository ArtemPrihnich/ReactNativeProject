import { createSlice } from '@reduxjs/toolkit';

const initState = {
  userId: null,
  nickName: null,
  stateChange: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initState,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userId: payload.userId,
      nickName: payload.nickName,
    }),
    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    authSignOut: () => initState,
  },
});
