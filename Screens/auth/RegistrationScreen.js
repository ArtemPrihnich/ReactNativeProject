import React, { useState } from 'react';
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
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';

import PlusIcon from '../../assets/images/plus-icon.svg';
import { useKeyboard } from '../../utils/keyboardActive';
import { authSignUpUser } from '../../redux/auth/authOperations';
import { SignupSchema } from '../../schemas/authSchemas';

const RegistrationScreen = ({ navigation }) => {
  const [isActiveLoginInput, setIsActiveLoginInput] = useState(false);
  const [isActiveEmailInput, setIsActiveEmailInput] = useState(false);
  const [isActivePasswordInput, setIsActivePasswordInput] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(true);
  const [userPhoto, setUserPhoto] = useState(null);

  const { isUserLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const toast = useToast();

  const { currenValue } = useKeyboard(-186, 0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      marginBottom: withTiming(currenValue.value, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      }),
    };
  });

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

  const deleteUserPhoto = () => setUserPhoto(null);

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

  return (
    <ScrollView scrollEnabled={false} contentContainerStyle={{ flexGrow: 1 }}>
      <Animated.View style={[styles.screenContainer, animatedStyles]}>
        <ImageBackground style={styles.bgImage} source={require('../../assets/images/bgImage.jpg')}>
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
              <View style={styles.formContainer}>
                <View style={styles.photoContainer}>
                  <Image style={styles.userPhoto} source={{ uri: userPhoto }} />
                  {!userPhoto && (
                    <TouchableOpacity style={styles.buttonContainer} onPress={addUserPhoto}>
                      <PlusIcon width={25} height={25} fill="#FF6C00" />
                    </TouchableOpacity>
                  )}
                  {userPhoto && (
                    <TouchableOpacity
                      style={{
                        ...styles.buttonContainer,
                        transform: [{ rotate: '45deg' }],
                      }}
                      onPress={deleteUserPhoto}
                    >
                      <PlusIcon width={25} height={25} fill="#BDBDBD" />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.title}>Регистрация</Text>
                <View style={styles.form}>
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
                    style={{
                      ...styles.submitBtn,
                      backgroundColor:
                        (isUserLoading && isValid) || !isValid ? '#F6F6F6' : '#FF6C00',
                    }}
                    disabled={!isValid || isUserLoading}
                    onPress={handleSubmit}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={{
                        ...styles.submitBtnText,
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
                    <Text style={styles.redirect}>Уже есть аккаунт? Войти</Text>
                  </TouchableOpacity>
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
  bgImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  formContainer: {
    position: 'relative',

    paddingTop: 92,
    paddingBottom: 78,

    backgroundColor: '#ffffff',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  photoContainer: {
    position: 'absolute',
    top: -60,
    left: '50%',

    width: 120,
    height: 120,

    transform: [{ translateX: -60 }],

    backgroundColor: '#F6F6F6',
    borderRadius: 16,
  },
  userPhoto: {
    flex: 1,

    resizeMode: 'contain',
    borderRadius: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 14,
    right: -12.5,
    width: 25,
    height: 25,
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
  form: {
    marginHorizontal: 16,
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
    position: 'absolute',
    right: 16,
    top: '50%',

    padding: 8,

    transform: [{ translateY: -17 }],

    zIndex: 1,
  },
  showPasswordText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,

    color: '#1B4371',
  },
  submitBtn: {
    justifyContent: 'center',
    flexDirection: 'row',

    marginTop: 27,
    marginBottom: 16,
    paddingTop: 16,
    paddingBottom: 16,

    borderRadius: 100,
  },
  submitBtnText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
  },
  redirect: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center',

    color: '#1B4371',
  },
});
