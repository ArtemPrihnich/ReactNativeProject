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
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { authSignInUser } from '../../redux/auth/authOperations';
import { useToast } from 'react-native-toast-notifications';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useKeyboard } from '../../utils/keyboardActive';

const LoginScreen = ({ navigation }) => {
  const [isActiveEmailInput, setIsActiveEmailInput] = useState(false);
  const [isActivePasswordInput, setIsActivePasswordInput] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(true);

  const { isUserLoading } = useSelector(state => state.auth);

  const dispatch = useDispatch();
  const toast = useToast();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Невалидная почта').required('Обязательное поле'),
    password: Yup.string()
      .min(8, 'Минимальная длина пароля 8 символов!')
      .max(30, 'Максимальная длина пароля 30 символов!')
      .required('Обязательное поле'),
  });

  const onSubmitClick = async (values, formik) => {
    const userInfo = {
      ...values,
      toast,
    };
    dispatch(authSignInUser(userInfo));
    console.log(values);
    formik.resetForm();
    Keyboard.dismiss();
  };

  const margAnim = useKeyboard(-253, 0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      marginBottom: withTiming(margAnim.value, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      }),
    };
  });

  return (
    <ScrollView scrollEnabled={false} contentContainerStyle={{ flexGrow: 1 }}>
      <Animated.View style={[styles.screenContainer, animatedStyles]}>
        <ImageBackground style={styles.image} source={require('../../assets/images/bgImage.jpg')}>
          {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={LoginSchema}
            validateOnMount
            onSubmit={(values, formik) => onSubmitClick(values, formik)}
          >
            {({
              values,
              errors,
              touched,
              isValid,
              setFieldTouched,
              handleChange,
              handleSubmit,
            }) => (
              <View style={{ ...styles.form }}>
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
                    style={{
                      ...styles.button,
                      backgroundColor:
                        (isUserLoading && isValid) || !isValid ? '#F6F6F6' : '#FF6C00',
                    }}
                    disabled={!isValid}
                    onPress={handleSubmit}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={{
                        ...styles.buttonText,
                        color: (isUserLoading && isValid) || !isValid ? '#BDBDBD' : '#FFFFFF',
                      }}
                    >
                      Войти
                    </Text>
                    {isUserLoading && (
                      <ActivityIndicator style={{ marginLeft: 10 }} color="#FF6C00" />
                    )}
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
          {/* </KeyboardAvoidingView> */}
        </ImageBackground>
      </Animated.View>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
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
    flexDirection: 'row',
    justifyContent: 'center',

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
