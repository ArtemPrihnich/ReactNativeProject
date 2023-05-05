import { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

export const useKeyboard = (hideButtons, showButtons) => {
  const currenValue = useSharedValue(0);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);

  useEffect(() => {
    function onKeyboardDidShow() {
      setIsKeyboardActive(true);
      return (currenValue.value = hideButtons);
    }

    function onKeyboardDidHide() {
      setIsKeyboardActive(false);
      return (currenValue.value = showButtons);
    }

    const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return { currenValue, isKeyboardActive };
};
