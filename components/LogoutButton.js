import React from 'react';
import { TouchableOpacity } from 'react-native';
import LogOut from '../assets/images/log-out.svg';
import { useDispatch } from 'react-redux';
import { authLogOutUser } from '../redux/auth/authOperations';

const LogoutButton = () => {
  const dispatch = useDispatch();

  const onLogOutClick = () => dispatch(authLogOutUser());
  return (
    <TouchableOpacity onPress={onLogOutClick}>
      <LogOut width={24} height={24} />
    </TouchableOpacity>
  );
};

export default LogoutButton;
