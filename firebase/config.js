import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA4lzp_DOZ0FnAiWmiWqS75-NsNvcfIgjI',
  authDomain: 'rn-social-a301a.firebaseapp.com',
  projectId: 'rn-social-a301a',
  storageBucket: 'rn-social-a301a.appspot.com',
  messagingSenderId: '611348809379',
  appId: '1:611348809379:web:1472156a05cc1c6b37e116',
  storageBucket: 'gs://rn-social-a301a.appspot.com',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export const cloudStorage = getStorage(app);
