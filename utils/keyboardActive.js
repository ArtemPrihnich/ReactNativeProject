import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export const useKeyboard = height => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    function onKeyboardDidShow(keyboard) {
      setKeyboardHeight(-keyboard.endCoordinates.height + height);
    }

    function onKeyboardDidHide() {
      setKeyboardHeight(0);
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
