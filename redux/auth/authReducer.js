import { createSlice } from '@reduxjs/toolkit';

const initState = {
  userId: null,
  userPhoto: null,
  nickName: null,
  stateChange: false,
  isLoading: false,
  isUserLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initState,
  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userId: payload.userId,
      nickName: payload.nickName,
      userPhoto: payload.userPhoto,
    }),
    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    authSignOut: (state, { payload }) => ({
      userId: null,
      userPhoto: null,
      nickName: null,
      stateChange: payload.stateChange,
      isLoading: false,
      isUserLoading: false,
    }),
    updateUserPhoto: (state, { payload }) => ({
      ...state,
      userPhoto: payload.userPhoto,
    }),
    setLoadingState: (state, { payload }) => ({
      ...state,
      isLoading: payload.isLoading,
    }),
    setUserLoadingState: (state, { payload }) => ({
      ...state,
      isUserLoading: payload.isUserLoading,
    }),
  },
});
