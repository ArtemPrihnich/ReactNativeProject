import { Camera, CameraType } from 'expo-camera';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, ImageBackground } from 'react-native';
import CameraIcon from '../assets/images/camera-icon.svg';
import TrashIcon from '../assets/images/trash.svg';

const CameraElement = ({ writePhoto, writeLocation, photo, location }) => {
  const [locationPermission, locationRequestPermission] = Location.useForegroundPermissions();
  const [cameraPermission, cameraRequestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);

  const getPermission = async () => {
    cameraRequestPermission();
    locationRequestPermission();
  };

  if (!cameraPermission) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted || !locationPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={getPermission} activeOpacity={0.8}>
          <Text style={styles.buttonText}>GRANT PERMISSION</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    const makePhoto = await camera.takePictureAsync();
    writePhoto(makePhoto.uri);
    const getLocation = await Location.getCurrentPositionAsync();
    writeLocation(getLocation.coords);
  };
  const deletePhoto = () => {
    writePhoto(null);
    writeLocation(null);
  };

  return (
    <View>
      {photo && (
        <View style={styles.photoContainer}>
          <ImageBackground style={styles.photo} source={{ uri: photo }}>
            <TouchableOpacity
              style={{ ...styles.takePhotoButton, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
              onPress={deletePhoto}
            >
              <TrashIcon width={24} height={24} fill="#FFFFFF" />
            </TouchableOpacity>
          </ImageBackground>
        </View>
      )}
      {!photo && (
        <Camera style={styles.camera} type={CameraType.back} ref={setCamera}>
          <TouchableOpacity style={styles.takePhotoButton} onPress={takePhoto}>
            <CameraIcon width={24} height={24} fill={'#BDBDBD'} />
          </TouchableOpacity>
        </Camera>
      )}
    </View>
  );
};

export default CameraElement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
  },
  button: {
    alignItems: 'center',
    paddingVertical: 5,
    marginHorizontal: 80,
    backgroundColor: '#FF6C00',
    borderRadius: 20,
  },
  buttonText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
    color: '#FFFFFF',
  },
  camera: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  takePhotoButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    fill: '#BDBDBD',
    borderRadius: 50,
  },
  photoContainer: {
    position: 'absolute',
    width: '100%',
    height: 240,
  },
  photo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
