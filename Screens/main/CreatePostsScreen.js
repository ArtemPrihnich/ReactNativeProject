import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import MapPin from '../../assets/images/map-pin.svg';
import TrashIcon from '../../assets/images/trash.svg';
import CameraElement from '../../components/CameraElement';

const CreatePostsScreen = ({ navigation }) => {
  const [titleInput, setTitleInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);

  const writePhoto = data => setPhoto(data);
  const writeLocation = data => setLocation(data);

  const sendPosts = () => {
    navigation.navigate('Posts', { photo, location, titleInput, locationInput });
    setPhoto(null);
    setLocation(null);
    setTitleInput('');
    setLocationInput('');
  };

  const clearButton = () => {
    setPhoto(null);
    setLocation(null);
    setTitleInput('');
    setLocationInput('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.photoBox}>
          <CameraElement
            writePhoto={writePhoto}
            writeLocation={writeLocation}
            photo={photo}
            location={location}
          />
        </View>
        <Text style={styles.photoBoxLabel}>{photo ? 'Редактировать фото' : 'Загрузить фото'}</Text>
        <TextInput
          style={{ ...styles.input, marginTop: 48 }}
          value={titleInput}
          onChangeText={value => setTitleInput(value)}
          maxLength={20}
          placeholder="Название..."
        />
        <View style={styles.mapInputBox}>
          <TextInput
            style={{ ...styles.input, marginTop: 32, paddingLeft: 28 }}
            value={locationInput}
            onChangeText={value => setLocationInput(value)}
            maxLength={20}
            placeholder="Киев, Украина"
          />
          <MapPin style={styles.mapIcon} width={24} height={24} />
        </View>
        <TouchableOpacity style={styles.button} onPress={sendPosts}>
          <Text style={styles.buttonText}>Опубликовать</Text>
        </TouchableOpacity>
      </View>
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
