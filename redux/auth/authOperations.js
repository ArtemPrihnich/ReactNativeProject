import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { auth } from '../../firebase/config';
import { authSlice } from './authReducer';

const { updateUserProfile, authSignOut, authStateChange } = authSlice.actions;

export const authSignUpUser =
  ({ email, login, password }) =>
  async (dispatch, getState) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: login,
      });

      const { uid, displayName } = await auth.currentUser;

      dispatch(updateUserProfile({ userId: uid, nickName: displayName }));
    } catch (error) {
      console.log('error', error);
      console.log('error.message', error.message);
    }
  };
export const authSignInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
    } catch (error) {
      console.log('error', error);
      console.log('error.message', error.message);
    }
  };
export const authLogOutUser = () => async (dispatch, getState) => {
  try {
    await signOut(auth);
    dispatch(authSignOut({ stateChange: false }));
  } catch (error) {
    console.log('error', error);
    console.log('error.message', error.message);
  }
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  try {
    await onAuthStateChanged(auth, user => {
      if (user) {
        dispatch(authStateChange({ stateChange: true }));
        dispatch(updateUserProfile({ userId: user.uid, nickName: user.displayName }));
      }
    });
  } catch (error) {
    console.log('error', error);
    console.log('error.message', error.message);
  }
};
