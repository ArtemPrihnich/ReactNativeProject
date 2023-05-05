import { ref, deleteObject } from 'firebase/storage';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from 'firebase/auth';

import { auth, cloudStorage } from '../../firebase/config';
import { uploadUserPhoto } from '../../services/API';
import { authSlice } from './authReducer';

const {
  updateUserProfile,
  authSignOut,
  authStateChange,
  updateUserPhoto,
  setLoadingState,
  setUserLoadingState,
} = authSlice.actions;

export const authSignUpUser =
  ({ email, login, password, userPhoto, toast }) =>
  async (dispatch, getState) => {
    try {
      dispatch(setUserLoadingState({ isUserLoading: true }));
      await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = auth.currentUser;
      if (userPhoto) {
        const photo = await uploadUserPhoto(userPhoto, uid);
        await updateProfile(auth.currentUser, {
          displayName: login,
          photoURL: photo,
        });
        dispatch(updateUserProfile({ userId: uid, nickName: login, userPhoto: photo }));
        dispatch(setUserLoadingState({ isUserLoading: false }));
        return;
      }
      await updateProfile(auth.currentUser, {
        displayName: login,
      });
      dispatch(updateUserProfile({ userId: uid, nickName: login, userPhoto: null }));
      dispatch(setUserLoadingState({ isUserLoading: false }));
    } catch (error) {
      dispatch(setUserLoadingState({ isUserLoading: false }));
      if (error.code === 'auth/email-already-in-use') {
        return toast.show(`Данная почта уже используется`, {
          placement: 'top',
          type: 'danger',
        });
      }
      if (error.code === 'auth/invalid-email') {
        return toast.show(`Не валидная почта`, {
          placement: 'top',
          type: 'danger',
        });
      }
      toast.show(`Что-то пошло не так, попробуйте ещё раз`, {
        placement: 'top',
        type: 'danger',
      });
    }
  };

export const authSignInUser =
  ({ email, password, toast }) =>
  async (dispatch, getState) => {
    try {
      dispatch(setUserLoadingState({ isUserLoading: true }));
      await signInWithEmailAndPassword(auth, email, password);
      dispatch(setUserLoadingState({ isUserLoading: false }));
    } catch (error) {
      dispatch(setUserLoadingState({ isUserLoading: false }));
      if (error.code === 'auth/user-not-found') {
        return toast.show('Пользователь не найден, проверьте введённые данные', {
          placement: 'top',
          type: 'danger',
        });
      }
      if (error.code === 'auth/wrong-password') {
        return toast.show('Неверная почта или пароль', {
          placement: 'top',
          type: 'danger',
        });
      }
      toast.show(`Что-то пошло не так, попробуйте ещё раз`, {
        placement: 'top',
        type: 'danger',
      });
    }
  };

export const authLogOutUser =
  ({ toast }) =>
  async (dispatch, getState) => {
    try {
      await signOut(auth);
      dispatch(authSignOut({ stateChange: false }));
    } catch (error) {
      toast.show('Что-то пошло не так, мы не смогли вас разлогинить.', {
        placement: 'top',
        type: 'danger',
      });
    }
  };

export const authStateChangeUser = () => async (dispatch, getState) => {
  try {
    dispatch(setLoadingState({ isLoading: true }));
    await onAuthStateChanged(auth, user => {
      if (user) {
        dispatch(authStateChange({ stateChange: true }));
        dispatch(
          updateUserProfile({
            userId: user.uid,
            nickName: user.displayName,
            userPhoto: user.photoURL,
          })
        );
        dispatch(setLoadingState({ isLoading: false }));
        return;
      }
      dispatch(setLoadingState({ isLoading: false }));
    });
  } catch (error) {
    dispatch(setLoadingState({ isLoading: false }));
  }
};

export const changeUserPhoto = (photo, toast) => async (dispatch, getState) => {
  try {
    dispatch(setLoadingState({ isLoading: true }));
    const { uid } = auth.currentUser;
    if (photo) {
      await uploadUserPhoto(photo, uid);
      await updateProfile(auth.currentUser, {
        photoURL: photo,
      });
      dispatch(updateUserPhoto({ userPhoto: photo }));
      dispatch(setLoadingState({ isLoading: false }));
      return;
    }
    await deleteObject(ref(cloudStorage, `usersPhoto/${uid}`));
    await updateProfile(auth.currentUser, {
      photoURL: '',
    });
    dispatch(updateUserPhoto({ userPhoto: null }));
    dispatch(setLoadingState({ isLoading: false }));
  } catch (error) {
    dispatch(setLoadingState({ isLoading: false }));
    toast.show('Что-то пошло не так, мы не смогли загрузить/удалить ваше фото.', {
      placement: 'top',
      type: 'danger',
    });
  }
};
