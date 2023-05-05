import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import 'react-native-get-random-values';
import { useToast } from 'react-native-toast-notifications';
import { Formik } from 'formik';

import { CreatePostSchema } from '../../schemas/postSchema';
import { uploadPhotoToServer, uploadPostToServer } from '../../services/API';

import CameraElement from '../../components/CameraElement';

import MapPin from '../../assets/images/map-pin.svg';
import TrashIcon from '../../assets/images/trash-icon.svg';

const CreatePostsScreen = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationState, setLocationState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { userId, nickName } = useSelector(state => state.auth);
  const toast = useToast();

  const sendPosts = async (values, formik) => {
    try {
      setIsLoading(true);
      const { title, locationName } = values;
      const processedPhoto = await uploadPhotoToServer(photo, toast);
      const uploadPost = await uploadPostToServer(
        processedPhoto,
        title,
        locationName,
        location,
        userId,
        nickName,
        toast
      );

      if (!processedPhoto || !uploadPost) {
        navigation.navigate('Posts');
        formik.resetForm();
        formik.validateForm();
        setPhoto(null);
        setLocation(null);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const clearButton = (resetForm, validateForm) => {
    resetForm();
    validateForm();
    setPhoto(null);
    setLocation(null);
  };

  return (
    <View style={styles.screenContainer}>
      <Formik
        initialValues={{
          title: '',
          locationName: '',
        }}
        validationSchema={CreatePostSchema}
        validateOnMount="true"
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
          validateForm,
        }) => (
          <View style={styles.formContainer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
              <View style={styles.form}>
                <View style={styles.photoContainer}>
                  <CameraElement
                    writePhoto={setPhoto}
                    writeLocation={setLocation}
                    photo={photo}
                    location={location}
                    setLocationState={setLocationState}
                  />
                </View>
                <Text style={styles.photoContainerText}>
                  {photo ? 'Редактировать фото' : 'Загрузить фото (Обязательно)'}
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
                  <View style={styles.mapInputContainer}>
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
                    ...styles.submitBtn,
                    backgroundColor:
                      !photo || isLoading || (!locationState && !isValid) || !isValid
                        ? '#F6F6F6'
                        : '#FF6C00',
                  }}
                  disabled={!photo || isLoading || !isValid || locationState}
                  onPress={handleSubmit}
                >
                  <Text
                    style={{
                      ...styles.submitBtnText,
                      color:
                        !photo || isLoading || (!locationState && !isValid) || !isValid
                          ? '#BDBDBD'
                          : '#FFFFFF',
                    }}
                  >
                    {!locationState ? 'Опубликовать' : 'Записываем геолокацию...'}
                  </Text>
                  {isLoading && <ActivityIndicator style={{ marginLeft: 10 }} color="#FF6C00" />}
                </TouchableOpacity>
              </View>
              <View style={styles.deleteBtnContainer}>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => clearButton(resetForm, validateForm)}
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
  screenContainer: {
    flex: 1,

    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    flex: 1,
  },
  form: {
    marginTop: 32,
    marginHorizontal: 16,
  },
  photoContainer: {
    height: 240,
    marginBottom: 8,

    overflow: 'hidden',

    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
  },
  photoContainerText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,

    color: '#BDBDBD',
  },
  inputContainer: {
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
  mapInputContainer: {
    position: 'relative',
    flexDirection: 'row',
  },
  mapIcon: {
    position: 'absolute',
    top: 0,

    transform: [{ translateY: 1 }],
  },
  submitBtn: {
    flexDirection: 'row',
    justifyContent: 'center',

    paddingVertical: 16,
    marginTop: 32,

    backgroundColor: '#FF6C00',
    borderRadius: 100,
  },
  submitBtnText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center',
  },
  deleteBtnContainer: {
    alignItems: 'center',
  },
  deleteBtn: {
    marginBottom: 22,
    paddingHorizontal: 23,
    paddingVertical: 8,

    backgroundColor: '#F6F6F6',
    borderRadius: 20,
  },
});
