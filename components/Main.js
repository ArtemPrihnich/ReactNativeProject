import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { ToastProvider } from 'react-native-toast-notifications';

import { authStateChangeUser } from '../redux/auth/authOperations';
import { useRoute } from '../utils/router';

const Main = () => {
  const { stateChange } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authStateChangeUser());
  }, []);

  const routing = useRoute(stateChange);

  return (
    <ToastProvider offsetTop={50} duration={2000}>
      <NavigationContainer>{routing}</NavigationContainer>
    </ToastProvider>
  );
};

export default Main;
