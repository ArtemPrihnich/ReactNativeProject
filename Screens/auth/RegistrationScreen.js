import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ImageBackground,
} from 'react-native';
import { useKeyboard } from '../../utils/keyboardActive';
import AddImage from '../../assets/images/add-image.svg';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { authSignUpUser } from '../../redux/auth/authOperations';
import { useEffect } from 'react';

const RegistrationScreen = ({ navigation }) => {
  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);
  console.log(keyboardIsVisible);
  const [isActiveLoginInput, setIsActiveLoginInput] = useState(false);
  const [isActiveEmailInput, setIsActiveEmailInput] = useState(false);
  const [isActivePasswordInput, setIsActivePasswordInput] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(true);

  const dispatch = useDispatch();

  const keyboardHeight = useKeyboard();
  console.log(keyboardHeight);

  const onSubmitClick = (values, formik) => {
    dispatch(authSignUpUser(values));
    console.log(values);
    formik.resetForm();
    Keyboard.dismiss();
  };

  const SignupSchema = Yup.object().shape({
    login: Yup.string()
      .min(3, 'Min login length 3!')
      .max(20, 'Max login length 20!')
      .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .min(8, 'Min password length 8!')
      .max(30, 'Max password length 30!')
      .required('Required'),
  });

  // useEffect(() => {
  //   const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
  //   const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);

  //   function onKeyboardDidShow() {
  //     setKeyboardIsVisible(true);
  //   }

  //   function onKeyboardDidHide() {
  //     setKeyboardIsVisible(false);
  //   }

  //   return () => {
  //     showSubscription.remove();
  //     hideSubscription.remove();
  //   };
  // }, []);

  return (
    <ImageBackground style={styles.image} source={require('../../assets/images/bgImage.jpg')}>
      {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
      <Formik
        initialValues={{
          login: '',
          email: '',
          password: '',
        }}
        validationSchema={SignupSchema}
        validateOnMount
        onSubmit={(values, formik) => onSubmitClick(values, formik)}
      >
        {({ values, errors, touched, handleChange, setFieldTouched, isValid, handleSubmit }) => (
          <View style={{ ...styles.form, marginBottom: keyboardHeight ? -186 : 0 }}>
            <View style={styles.imgBox}>
              <TouchableOpacity style={styles.addImgBtn}>
                <AddImage width={25} height={25} />
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>Регистрация</Text>
            <View style={styles.box}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={{
                    ...styles.input,
                    borderColor: isActiveLoginInput ? '#FF6C00' : '#E8E8E8',
                  }}
                  placeholder="Логин"
                  placeholderTextColor="#BDBDBD"
                  value={values.login}
                  id="login"
                  onChangeText={handleChange('login')}
                  onFocus={() => setIsActiveLoginInput(true)}
                  onBlur={() => {
                    setIsActiveLoginInput(false);
                    setFieldTouched('login');
                  }}
                />
                {touched.login && errors.login && (
                  <Text style={styles.errorMessage}>{errors.login}</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={{
                    ...styles.input,
                    borderColor: isActiveEmailInput ? '#FF6C00' : '#E8E8E8',
                  }}
                  placeholder="Адрес электронной почты"
                  placeholderTextColor="#BDBDBD"
                  value={values.email}
                  id={1}
                  onChangeText={handleChange('email')}
                  onFocus={() => setIsActiveEmailInput(true)}
                  onBlur={() => {
                    setIsActiveEmailInput(false);
                    setFieldTouched('email');
                  }}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorMessage}>{errors.email}</Text>
                )}
              </View>
              <View style={{ ...styles.inputContainer }}>
                <View style={{ position: 'relative' }}>
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
                    value={values.password}
                    id="password"
                    onChangeText={handleChange('password')}
                    onFocus={() => setIsActivePasswordInput(true)}
                    onBlur={() => {
                      setIsActivePasswordInput(false);
                      setFieldTouched('password');
                    }}
                  />
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.errorMessage}>{errors.password}</Text>
                )}
              </View>
              <TouchableOpacity
                style={{ ...styles.button, backgroundColor: isValid ? '#FF6C00' : '#F6F6F6' }}
                disabled={!isValid}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text style={{ ...styles.buttonText, color: isValid ? '#FFFFFF' : '#BDBDBD' }}>
                  Зарегистрироваться
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
                <Text style={styles.link}>Уже есть аккаунт? Войти</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
      {/* </KeyboardAvoidingView> */}
    </ImageBackground>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    // resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  imgBox: {
    position: 'absolute',
    top: -60,
    left: '50%',
    transform: [{ translateX: -60 }],
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
  inputContainer: {
    marginBottom: 8,
    paddingBottom: 16,
  },
  input: {
    padding: 16,

    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,

    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E8E8E8',

    color: '#212121',
    backgroundColor: '#F6F6F6',
  },
  errorMessage: {
    position: 'absolute',
    bottom: 0,
    left: 8,

    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    lineHeight: 16,

    color: `#FF0000`,
  },
  showPassword: {
    right: 16,
    top: '50%',
    transform: [{ translateY: -9.5 }],
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
  },
  buttonText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
  },
  link: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center',

    color: '#1B4371',
  },
});
