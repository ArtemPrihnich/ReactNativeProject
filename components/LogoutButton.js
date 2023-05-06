import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';

import { authLogOutUser } from '../redux/auth/authOperations';

import LogOut from '../assets/images/log-out.svg';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const onLogOutClick = () => dispatch(authLogOutUser({ toast }));
  return (
    <TouchableOpacity style={{ padding: 4 }} onPress={onLogOutClick}>
      <LogOut width={24} height={24} />
    </TouchableOpacity>
  );
};

export default LogoutButton;
