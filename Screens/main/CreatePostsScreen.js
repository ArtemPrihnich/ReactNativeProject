import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import MapPin from '../../assets/images/map-pin.svg';
import TrashIcon from '../../assets/images/trash-icon.svg';
import CameraElement from '../../components/CameraElement';

const CreatePostsScreen = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);

  const CreatePostSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, 'Минимальная длина названия 3')
      .max(20, 'Максимальная длина названия 20')
      .required('Required'),
    locationName: Yup.string()
      .max(40, 'Максимальная длина местоположения 40')
      .matches(
        /^[А-ЯA-Z]{1}[а-яa-z]{1,20}[,]{1} [А-ЯA-Z]{1}[а-яa-z]{1,20}$/,
        'Введите местоположение следующего формата Регион, Страна'
      )
      .required('Required'),
  });

  const writePhoto = data => setPhoto(data);
  const writeLocation = data => setLocation(data);

  const sendPosts = (values, formik) => {
    const { title, locationName } = values;
    navigation.navigate('Posts', { photo, location, title, locationName });
    formik.resetForm();
  };

  const clearButton = () => {
    // setPhoto(null);
    // setLocation(null);
    // setTitleInput('');
    // setLocationInput('');
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'position'}>
        <Formik
          initialValues={{
            title: '',
            locationName: '',
          }}
          validationSchema={CreatePostSchema}
          validateOnMount
          onSubmit={(values, formik) => sendPosts(values, formik)}
        >
          {({ values, errors, touched, isValid, setFieldTouched, handleChange, handleSubmit }) => (
            <View style={styles.form}>
              <View style={styles.photoBox}>
                <CameraElement
                  writePhoto={writePhoto}
                  writeLocation={writeLocation}
                  photo={photo}
                  location={location}
                />
              </View>
              <Text style={styles.photoBoxLabel}>
                {photo ? 'Редактировать фото' : 'Загрузить фото'}
              </Text>
              <TextInput
                style={{ ...styles.input, marginTop: 48 }}
                value={values.title}
                onChangeText={handleChange('title')}
                placeholder="Название..."
                onFocus={() => setFieldTouched('title')}
              />
              {touched.title && errors.title && (
                <Text style={styles.errorMessage}>{errors.title}</Text>
              )}
              <View style={styles.mapInputBox}>
                <TextInput
                  style={{ ...styles.input, marginTop: 32, paddingLeft: 28 }}
                  value={values.locationName}
                  onChangeText={handleChange('locationName')}
                  placeholder="Киев, Украина"
                  onFocus={() => setFieldTouched('locationName')}
                />
                <MapPin style={styles.mapIcon} width={24} height={24} />
                {touched.locationName && errors.locationName && (
                  <Text style={styles.errorMessage}>{errors.locationName}</Text>
                )}
              </View>
              <TouchableOpacity
                style={{ ...styles.button, backgroundColor: isValid ? '#FF6C00' : '#F6F6F6' }}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Опубликовать</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
      <View style={styles.deleteButtonBox}>
        <TouchableOpacity style={styles.deleteButton} onPress={clearButton}>
          <TrashIcon width={24} height={24} fill="#BDBDBD" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreatePostsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    // alignItems: 'center',
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
  input: {
    paddingBottom: 15,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
    color: '#212121',

    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
  },
  errorMessage: {
    marginTop: 4,
    marginLeft: 8,

    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    lineHeight: 16,

    color: `#FF0000`,
  },
  mapInputBox: {
    position: 'relative',
  },
  mapIcon: {
    position: 'absolute',
    bottom: 0,
    transform: [{ translateY: -16 }],
  },
  button: {
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

    color: '#FFFFFF',
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
