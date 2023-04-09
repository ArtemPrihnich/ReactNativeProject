import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';

import { useRoute } from '../utils/router';

import { useDispatch, useSelector } from 'react-redux';
import { authStateChangeUser } from '../redux/auth/authOperations';

const Main = () => {
  const { stateChange } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authStateChangeUser());
  }, []);

  const routing = useRoute(stateChange);
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <NavigationContainer>{routing}</NavigationContainer>
    </TouchableWithoutFeedback>
  );
};

export default Main;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
// });
