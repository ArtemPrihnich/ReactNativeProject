import React from 'react';
import { TouchableOpacity } from 'react-native';
import LogOut from '../assets/images/log-out.svg';
import { useDispatch } from 'react-redux';
import { authLogOutUser } from '../redux/auth/authOperations';
import { useToast } from 'react-native-toast-notifications';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const onLogOutClick = () => dispatch(authLogOutUser({ toast }));
  return (
    <TouchableOpacity onPress={onLogOutClick}>
      <LogOut width={24} height={24} />
    </TouchableOpacity>
  );
};

export default LogoutButton;
