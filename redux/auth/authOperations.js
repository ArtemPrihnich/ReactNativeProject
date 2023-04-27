import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { auth, cloudStorage } from '../../firebase/config';
import { authSlice } from './authReducer';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const { updateUserProfile, authSignOut, authStateChange, updateUserPhoto } = authSlice.actions;

export const uploadUserPhoto = async (photo, id) => {
  try {
    const responce = await fetch(photo);
    const file = await responce.blob();
    const storageRef = ref(cloudStorage, `usersPhoto/${id}`);
    await uploadBytes(storageRef, file);
    const processedPhoto = await getDownloadURL(ref(storageRef));
    return processedPhoto;
  } catch (error) {
    console.log(error.message);
  }
};

export const authSignUpUser =
  ({ email, login, password, userPhoto }) =>
  async (dispatch, getState) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = auth.currentUser;
      if (userPhoto) {
        const photo = await uploadUserPhoto(userPhoto, uid);
        await updateProfile(auth.currentUser, {
          displayName: login,
          photoURL: photo,
        });
        dispatch(updateUserProfile({ userId: uid, nickName: login, userPhoto: photo }));
        return;
      }
      await updateProfile(auth.currentUser, {
        displayName: login,
      });
      dispatch(updateUserProfile({ userId: uid, nickName: login, userPhoto: null }));
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
      // console.log(user);
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
        // console.log(user);
        dispatch(authStateChange({ stateChange: true }));
        dispatch(
          updateUserProfile({
            userId: user.uid,
            nickName: user.displayName,
            userPhoto: user.photoURL,
          })
        );
      }
    });
  } catch (error) {
    console.log('error', error);
    console.log('error.message', error.message);
  }
};

export const changeUserPhoto = photo => async (dispatch, getState) => {
  try {
    const { photoURL } = auth.currentUser;
    if (photo) {
      await updateProfile(auth.currentUser, {
        photoURL: photo,
      });
      dispatch(updateUserPhoto({ userPhoto: photoURL }));
      return;
    }
    await updateProfile(auth.currentUser, {
      photoURL: null,
    });
    dispatch(updateUserPhoto({ userPhoto: null }));
  } catch (error) {
    console.log(error.message);
  }
};
