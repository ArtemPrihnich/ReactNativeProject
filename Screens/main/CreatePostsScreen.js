import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { cloudStorage, db } from '../../firebase/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import MapPin from '../../assets/images/map-pin.svg';
import TrashIcon from '../../assets/images/trash-icon.svg';
import CameraElement from '../../components/CameraElement';
import { useToast } from 'react-native-toast-notifications';

const CreatePostsScreen = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationState, setLocationState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { userId, nickName } = useSelector(state => state.auth);

  const toast = useToast();

  const CreatePostSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, 'Минимальная длина названия 3 символа!')
      .max(20, 'Максимальная длина названия 20 символов!')
      .required('Обязательное поле'),
    locationName: Yup.string()
      .max(40, 'Максимальная длина местоположения 40 символов!')
      .matches(
        /^[А-ЯA-Z]{1}[а-яa-z]{1,20}[-]{0,1}[А-ЯA-Z]{0,1}[а-яa-z]{0,10}[,]{1} [А-ЯA-Z]{1}[а-яa-z]{1,20}$/,
        'Введите местоположение в формате Регион, Страна'
      )
      .required('Обязательное поле'),
  });

  const writePhoto = data => setPhoto(data);
  const writeLocation = data => setLocation(data);

  const uploadPhotoToServer = async () => {
    try {
      const responce = await fetch(photo);
      console.log(responce);
      const file = await responce.blob();
      const uniquePhotoId = uuidv4();

      const storageRef = ref(cloudStorage, `postImage/${uniquePhotoId}`);
      await uploadBytes(storageRef, file);
      const processedPhoto = await getDownloadURL(ref(storageRef));

      return processedPhoto;
    } catch (error) {
      toast.show('Что-то пошло не так, мы не смогли загрузить вашу фотографию', {
        placement: 'top',
        type: 'danger',
      });
      return error;
    }
  };

  const uploadPostToServer = async (processedPhoto, title, locationName) => {
    try {
      await addDoc(collection(db, 'posts'), {
        photo: processedPhoto,
        title,
        locationName,
        location,
        userId,
        nickName,
        time: Date.now(),
      });
    } catch (error) {
      toast.show('Что-то пошло не так, мы не смогли загрузить ваш пост', {
        placement: 'top',
        type: 'danger',
      });
      return error;
    }
  };

  const sendPosts = async (values, formik) => {
    try {
      setIsLoading(true);
      const { title, locationName } = values;
      const processedPhoto = await uploadPhotoToServer();
      console.log(processedPhoto);
      const uploadPost = await uploadPostToServer(processedPhoto, title, locationName);

      if (!processedPhoto || !uploadPost) {
        navigation.navigate('Posts');
        formik.resetForm();
        setPhoto(null);
        setLocation(null);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const clearButton = resetForm => {
    resetForm();
    setPhoto(null);
    setLocation(null);
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          title: '',
          locationName: '',
        }}
        validationSchema={CreatePostSchema}
        validateOnMount
        onSubmit={(values, formik) => sendPosts(values, formik)}
      >
        {({
          values,
          errors,
          touched,
          isValid,
          setFieldTouched,
          handleChange,
          handleSubmit,
          resetForm,
        }) => (
          <View style={{ flex: 1 }}>
            {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'position'}> */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
              <View style={styles.form}>
                <View style={styles.photoBox}>
                  <CameraElement
                    writePhoto={writePhoto}
                    writeLocation={writeLocation}
                    photo={photo}
                    location={location}
                    setLocationState={setLocationState}
                  />
                </View>
                <Text style={styles.photoBoxLabel}>
                  {photo ? 'Редактировать фото' : 'Загрузить фото'}
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={{ ...styles.input, marginTop: 48 }}
                    value={values.title}
                    onChangeText={handleChange('title')}
                    placeholder="Название..."
                    onBlur={() => setFieldTouched('title')}
                  />
                  {touched.title && errors.title && (
                    <Text style={styles.errorMessage}>{errors.title}</Text>
                  )}
                </View>
                <View
                  style={{
                    ...styles.inputContainer,
                    marginTop: 32,
                    marginBottom: 10,
                  }}
                >
                  <View style={styles.mapInputBox}>
                    <MapPin style={styles.mapIcon} width={24} height={24} />
                    <TextInput
                      style={{ ...styles.input, paddingLeft: 28 }}
                      value={values.locationName}
                      onChangeText={handleChange('locationName')}
                      placeholder="Киев, Украина"
                      onFocus={() => setFieldTouched('locationName')}
                    />
                  </View>
                  {touched.locationName && errors.locationName && (
                    <Text style={styles.errorMessage}>{errors.locationName}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={{
                    ...styles.button,
                    backgroundColor:
                      isLoading || (!locationState && !isValid) || !isValid ? '#F6F6F6' : '#FF6C00',
                  }}
                  disabled={isLoading || !isValid || locationState}
                  onPress={handleSubmit}
                >
                  <Text
                    style={{
                      ...styles.buttonText,
                      color:
                        isLoading || (!locationState && !isValid) || !isValid
                          ? '#BDBDBD'
                          : '#FFFFFF',
                    }}
                  >
                    {!locationState ? 'Опубликовать' : 'Записываем геолокацию...'}
                  </Text>
                  {isLoading && <ActivityIndicator style={{ marginLeft: 10 }} color="#FF6C00" />}
                </TouchableOpacity>
              </View>
              {/* </KeyboardAvoidingView> */}
              <View style={styles.deleteButtonBox}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => clearButton(resetForm)}
                >
                  <TrashIcon width={24} height={24} fill="#BDBDBD" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default CreatePostsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginBottom: 50,
    backgroundColor: '#FFFFFF',
  },
  form: {
    marginTop: 32,
    marginHorizontal: 16,
  },
  photoBox: {
    height: 240,
    marginBottom: 8,
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoBoxLabel: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
    color: '#BDBDBD',
  },
  inputContainer: {
    // paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
  },
  input: {
    width: '100%',
    paddingBottom: 16,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
    color: '#212121',
  },
  errorMessage: {
    position: 'absolute',
    bottom: 3,
    marginTop: 4,
    marginLeft: 8,

    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    lineHeight: 16,

    color: `#FF0000`,
  },
  mapInputBox: {
    position: 'relative',
    flexDirection: 'row',
  },
  mapIcon: {
    position: 'absolute',
    top: 0,
    transform: [{ translateY: 1 }],
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',

    paddingVertical: 16,
    marginTop: 32,
    backgroundColor: '#FF6C00',
    borderRadius: 100,
  },
  buttonText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center',
  },
  deleteButtonBox: {
    alignItems: 'center',
  },
  deleteButton: {
    marginBottom: 22,
    paddingHorizontal: 23,
    paddingVertical: 8,
    backgroundColor: '#F6F6F6',
    borderRadius: 20,
  },
});
