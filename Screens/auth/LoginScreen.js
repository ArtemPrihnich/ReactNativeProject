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
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { authSignInUser } from '../../redux/auth/authOperations';

const LoginScreen = ({ navigation }) => {
  const [isActiveEmailInput, setIsActiveEmailInput] = useState(false);
  const [isActivePasswordInput, setIsActivePasswordInput] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(true);

  const dispatch = useDispatch();

  const keyboardHeight = useKeyboard(0);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string()
      .min(8, 'Min password length 8!')
      .max(30, 'Max password length 30!')
      .required('Required'),
  });

  const onSubmitClick = (values, formik) => {
    dispatch(authSignInUser(values));
    console.log(values);
    formik.resetForm();
    Keyboard.dismiss();
  };

  return (
    <ImageBackground style={styles.image} source={require('../../assets/images/bgImage.jpg')}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : ''}>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={LoginSchema}
          validateOnMount
          onSubmit={(values, formik) => onSubmitClick(values, formik)}
        >
          {({ values, errors, touched, isValid, setFieldTouched, handleChange, handleSubmit }) => (
            <View style={{ ...styles.form, marginBottom: keyboardHeight }}>
              <Text style={styles.title}>Войти</Text>
              <View style={styles.box}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={{
                      ...styles.input,
                      borderColor: isActiveEmailInput ? '#FF6C00' : '#E8E8E8',
                    }}
                    placeholder="Адрес электронной почты"
                    placeholderTextColor="#BDBDBD"
                    value={values.email}
                    id="email"
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
                <View style={styles.inputContainer}>
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
                  {touched.password && errors.password && (
                    <Text style={styles.errorMessage}>{errors.password}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={{ ...styles.button, backgroundColor: isValid ? '#FF6C00' : '#F6F6F6' }}
                  disabled={!isValid}
                  onPress={handleSubmit}
                  activeOpacity={0.7}
                >
                  <Text style={{ ...styles.buttonText, color: isValid ? '#FFFFFF' : '#BDBDBD' }}>
                    Войти
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Register')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.link}>Нет аккаунта? Зарегистрироваться</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  box: {
    marginHorizontal: 16,
  },
  form: {
    paddingTop: 32,
    paddingBottom: 144,
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
    marginBottom: 16,
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
    marginTop: 4,
    marginLeft: 8,

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

    // backgroundColor: '#FF6C00',
  },
  buttonText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,

    // color: '#FFFFFF',
  },
  link: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center',

    color: '#1B4371',
  },
});
