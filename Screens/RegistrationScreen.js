import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
} from 'react-native';

const initialValue = {
  login: '',
  email: '',
  password: '',
};

const RegistrationScreen = () => {
  const [value, setValue] = useState(initialValue);
  const [isActiveLoginInput, setIsActiveLoginInput] = useState(false);
  const [isActiveEmailInput, setIsActiveEmailInput] = useState(false);
  const [isActivePasswordInput, setIsActivePasswordInput] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(true);

  const useKeyboard = () => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
      function onKeyboardDidShow(keyboard) {
        setKeyboardHeight(-keyboard.endCoordinates.height + 62);
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

  const keyboardHeight = useKeyboard();

  const onSubmitClick = () => {
    console.log(value);
    setValue(initialValue);
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''}>
      <View style={{ ...styles.form, marginBottom: keyboardHeight }}>
        <View style={styles.imgBox}>
          <TouchableOpacity style={styles.addImgBtn}>
            <Image source={require('../assets/images/addIcon.png')} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Регистрация</Text>
        <View style={styles.box}>
          <TextInput
            style={{ ...styles.input, borderColor: isActiveLoginInput ? '#FF6C00' : '#E8E8E8' }}
            placeholder="Логин"
            placeholderTextColor="#BDBDBD"
            value={value.login}
            id="login"
            onChangeText={value => setValue(prevState => ({ ...prevState, login: value }))}
            onFocus={() => setIsActiveLoginInput(true)}
            onBlur={() => setIsActiveLoginInput(false)}
          />
          <TextInput
            style={{ ...styles.input, borderColor: isActiveEmailInput ? '#FF6C00' : '#E8E8E8' }}
            placeholder="Адрес электронной почты"
            placeholderTextColor="#BDBDBD"
            value={value.email}
            id={1}
            onChangeText={value => setValue(prevState => ({ ...prevState, email: value }))}
            onFocus={() => setIsActiveEmailInput(true)}
            onBlur={() => setIsActiveEmailInput(false)}
          />
          <View>
            <TouchableOpacity
              style={styles.showPassword}
              onPress={() => setIsShowPassword(!isShowPassword)}
              activeOpacity={0.8}
            >
              <Text style={styles.showPasswordText}>Показать</Text>
            </TouchableOpacity>
            <TextInput
              style={{
                ...styles.input,
                borderColor: isActivePasswordInput ? '#FF6C00' : '#E8E8E8',
              }}
              placeholder="Пароль"
              placeholderTextColor="#BDBDBD"
              secureTextEntry={isShowPassword}
              value={value.password}
              id="password"
              onChangeText={value => setValue(prevState => ({ ...prevState, password: value }))}
              onFocus={() => setIsActivePasswordInput(true)}
              onBlur={() => setIsActivePasswordInput(false)}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={onSubmitClick} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Зарегистрироваться</Text>
          </TouchableOpacity>
          <Text style={styles.link}>Уже есть аккаунт? Войти</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  imgBox: {
    position: 'absolute',
    top: -60,
    left: '50%',
    transform: 'translateX(-50deg)',
    width: 120,
    height: 120,
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
  },
  addImgBtn: {
    position: 'absolute',
    bottom: 14,
    right: -12.5,
    width: 25,
    height: 25,
  },
  box: {
    marginHorizontal: 16,
  },
  form: {
    position: 'relative',
    paddingTop: 92,
    paddingBottom: 78,
    backgroundColor: '#ffffff',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  title: {
    marginBottom: 33,

    fontFamily: 'Roboto-Medium',
    fontSize: 30,
    lineHeight: 35,
    textAlign: 'center',
    letterSpacing: 0.01,

    color: '#212121',
  },
  input: {
    padding: 16,
    marginBottom: 16,

    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,

    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E8E8E8',

    color: '#212121',
    backgroundColor: '#F6F6F6',
  },
  showPassword: {
    right: 16,
    bottom: '50%',
    zIndex: 1,
    position: 'absolute',
  },
  showPasswordText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
    color: '#1B4371',
  },
  button: {
    marginTop: 27,
    marginBottom: 16,
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: 'center',
    borderRadius: 100,

    backgroundColor: '#FF6C00',
  },
  buttonText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,

    color: '#FFFFFF',
  },
  link: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center',
  },
});
