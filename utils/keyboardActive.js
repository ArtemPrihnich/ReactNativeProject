import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

export const useKeyboard = (hideButtons, showButtons) => {
  const margAnim = useSharedValue(0);
  // const [keyboardHeight, setKeyboardHeight] = useState(false);

  useEffect(() => {
    function onKeyboardDidShow() {
      return (margAnim.value = hideButtons);
    }

    function onKeyboardDidHide() {
      return (margAnim.value = showButtons);
    }

    const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return margAnim;
};
