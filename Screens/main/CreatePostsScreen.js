import React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import MapPin from '../../assets/images/map-pin.svg';
import TrashIcon from '../../assets/images/trash.svg';

const CreatePostsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.photoBox}></View>
        <Text style={styles.photoBoxLabel}>Загрузить фото</Text>
        <TextInput style={{ ...styles.input, marginTop: 48 }} placeholder="Название..." />
        <View style={styles.mapInputBox}>
          {/* <MapPin width={24} height={24} /> */}
          <TextInput
            style={{ ...styles.input, marginTop: 32, paddingLeft: 28 }}
            placeholder="Местность..."
          />
          <MapPin style={styles.mapIcon} width={24} height={24} />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Опубликовать</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.deleteButtonBox}>
        <TouchableOpacity style={styles.deleteButton}>
          <TrashIcon width={24} height={24} />
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
