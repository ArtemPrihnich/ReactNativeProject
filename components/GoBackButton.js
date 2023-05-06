import React from 'react';
import { TouchableOpacity } from 'react-native';

import ArrowLeft from '../assets/images/arrow-left.svg';

const GoBackButton = ({ navigation }) => {
  return (
    <TouchableOpacity style={{ padding: 4 }} onPress={() => navigation.goBack()}>
      <ArrowLeft width={24} height={24} />
    </TouchableOpacity>
  );
};

export default GoBackButton;
