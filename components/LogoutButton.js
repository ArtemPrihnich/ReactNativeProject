import React from 'react';
import { TouchableOpacity } from 'react-native';
import LogOut from '../assets/images/log-out.svg';

const LogoutButton = () => {
  return (
    <TouchableOpacity>
      <LogOut width={24} height={24} />
    </TouchableOpacity>
  );
};

export default LogoutButton;
