import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Image,
  ImageBackground,
  ActivityIndicator,
  Button,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useKeyboard } from '../../utils/keyboardActive';
import PlusIcon from '../../assets/images/plus-icon.svg';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { authSignUpUser } from '../../redux/auth/authOperations';
import { useToast } from 'react-native-toast-notifications';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  SlideInDown,
  FadeIn,
} from 'react-native-reanimated';

const RegistrationScreen = ({ navigation }) => {
  const [isActiveLoginInput, setIsActiveLoginInput] = useState(false);
  const [isActiveEmailInput, setIsActiveEmailInput] = useState(false);
  const [isActivePasswordInput, setIsActivePasswordInput] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(true);
  const [userPhoto, setUserPhoto] = useState(null);

  const { isUserLoading } = useSelector(state => state.auth);

  const margAnim = useKeyboard(-186, 0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      marginBottom: withTiming(margAnim.value, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      }),
    };
  });

  const dispatch = useDispatch();
  const toast = useToast();

  const onSubmitClick = (values, formik) => {
    const userInfo = {
      ...values,
      userPhoto,
      toast,
    };
    dispatch(authSignUpUser(userInfo));
    formik.resetForm();
    Keyboard.dismiss();
  };

  const addUserPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }

    const userPhoto = await ImagePicker.launchImageLibraryAsync();
    if (userPhoto.canceled) {
      return;
    }
    setUserPhoto(userPhoto.assets[0].uri);
  };

  const deleteUserPhoto = async () => {
    try {
      setUserPhoto(null);
    } catch (error) {
      console.log(error.message);
    }
  };

  const SignupSchema = Yup.object().shape({
    login: Yup.string()
      .min(3, 'Минимальная длина логина 3 символа!')
      .max(20, 'Максимальная длина логина 30 символов!')
      .required('Обязательное поле'),
    email: Yup.string().email('Невалидная почта').required('Обязательное поле'),
    password: Yup.string()
      .min(8, 'Минимальная длина пароля 8 символов!')
      .max(30, 'Максимальная длина пароля 30 символов!')
      .required('Обязательное поле'),
  });

  return (
    <ScrollView scrollEnabled={false} contentContainerStyle={{ flexGrow: 1 }}>
      <Animated.View style={[styles.screenContainer, animatedStyles]}>
        <ImageBackground style={styles.image} source={require('../../assets/images/bgImage.jpg')}>
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
            {({
              values,
              errors,
              touched,
              handleChange,
              setFieldTouched,
              isValid,
              handleSubmit,
            }) => (
              <View style={styles.form}>
                <View style={styles.imgBox}>
                  <Image
                    style={{ flex: 1, resizeMode: 'contain', borderRadius: 16 }}
                    source={{ uri: userPhoto }}
                  />
                  {!userPhoto && (
                    <TouchableOpacity style={styles.buttonBox} onPress={addUserPhoto}>
                      <PlusIcon width={25} height={25} fill="#FF6C00" />
                    </TouchableOpacity>
                  )}
                  {userPhoto && (
                    <TouchableOpacity
                      style={{
                        ...styles.buttonBox,
                        transform: [{ rotate: '45deg' }],
                      }}
                      onPress={deleteUserPhoto}
                    >
                      <PlusIcon width={25} height={25} fill="#BDBDBD" />
                    </TouchableOpacity>
                  )}
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
                  <View style={{}}>
                    <TouchableOpacity
                      style={{
                        ...styles.button,
                        backgroundColor:
                          (isUserLoading && isValid) || !isValid ? '#F6F6F6' : '#FF6C00',
                      }}
                      disabled={!isValid || isUserLoading}
                      onPress={handleSubmit}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={{
                          ...styles.buttonText,
                          color: (isUserLoading && isValid) || !isValid ? '#BDBDBD' : '#FFFFFF',
                        }}
                      >
                        Зарегистрироваться
                      </Text>
                      {isUserLoading && (
                        <ActivityIndicator style={{ marginLeft: 10 }} color="#FF6C00" />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Login')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.link}>Уже есть аккаунт? Войти</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </Formik>
        </ImageBackground>
      </Animated.View>
    </ScrollView>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
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
  buttonBox: {
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
    justifyContent: 'center',
    flexDirection: 'row',

    marginTop: 27,
    marginBottom: 16,
    paddingTop: 16,
    paddingBottom: 16,
    // alignItems: 'center',
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
