import React from 'react';
import { TouchableOpacity } from 'react-native';
import ArrowLeft from '../assets/images/arrow-left.svg';

const GoBackButton = () => {
  return (
    <TouchableOpacity>
      <ArrowLeft width={24} height={24} />
    </TouchableOpacity>
  );
};

export default GoBackButton;
