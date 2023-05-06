import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { collection, doc, addDoc, updateDoc, increment } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { cloudStorage, db } from '../firebase/config';

export const uploadPhotoToServer = async (photo, toast) => {
  try {
    const responce = await fetch(photo);
    const file = await responce.blob();
    const uniquePhotoId = uuidv4();

    const storageRef = ref(cloudStorage, `postImage/${uniquePhotoId}`);
    await uploadBytes(storageRef, file);
    const processedPhoto = await getDownloadURL(ref(storageRef));

    return processedPhoto;
  } catch (error) {
    toast.show('Что-то пошло не так, мы не смогли загрузить вашу фотографию', {
      placement: 'top',
      type: 'danger',
    });
    return error;
  }
};

export const uploadPostToServer = async (
  processedPhoto,
  title,
  locationName,
  location,
  userId,
  nickName,
  toast
) => {
  try {
    await addDoc(collection(db, 'posts'), {
      photo: processedPhoto,
      title,
      locationName,
      location,
      userId,
      nickName,
      comments: 0,
      time: Date.now(),
    });
  } catch (error) {
    toast.show('Что-то пошло не так, мы не смогли загрузить ваш пост', {
      placement: 'top',
      type: 'danger',
    });
    return error;
  }
};

export const uploadComment = async (commentsRef, comment, nickName, userPhoto, toast) => {
  try {
    await addDoc(commentsRef, { comment, nickName, time: Date.now(), userPhoto });
  } catch (error) {
    toast.show('Что-то пошло не так, мы не смогли загрузить ваш коментарий', {
      placement: 'top',
      type: 'danger',
    });
  }
};

export const updateCommentsCount = async id => {
  try {
    const postRef = doc(db, 'posts', id);
    await updateDoc(postRef, {
      comments: increment(1),
    });
  } catch (error) {
    console.log(error);
  }
};

export const uploadUserPhoto = async (photo, id) => {
  try {
    const responce = await fetch(photo);
    const file = await responce.blob();
    const storageRef = ref(cloudStorage, `usersPhoto/${id}`);
    await uploadBytes(storageRef, file);
    const processedPhoto = await getDownloadURL(ref(storageRef));
    return processedPhoto;
  } catch (error) {
    return error;
  }
};
