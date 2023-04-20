import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(false);

  useEffect(() => {
    function onKeyboardDidShow() {
      setKeyboardHeight(true);
    }

    function onKeyboardDidHide() {
      setKeyboardHeight(false);
    }

    const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardHeight;
};
