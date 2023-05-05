import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as Location from 'expo-location';

import CameraIcon from '../assets/images/camera-icon.svg';
import TrashIcon from '../assets/images/trash-icon.svg';

const CameraElement = ({ writePhoto, writeLocation, photo, setLocationState }) => {
  const [locationPermission, locationRequestPermission] = Location.useForegroundPermissions();
  const [cameraPermission, cameraRequestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);

  const getPermission = async () => {
    cameraRequestPermission();
    locationRequestPermission();
  };

  const takePhoto = async () => {
    const makePhoto = await camera.takePictureAsync();
    writePhoto(makePhoto.uri);
    setLocationState(true);
    const getLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low,
    });
    writeLocation(getLocation.coords);
    setLocationState(false);
  };

  const deletePhoto = () => {
    writePhoto(null);
    writeLocation(null);
  };

  return (
    <View style={styles.screenContainer}>
      {!cameraPermission && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={50} color="#FF6C00" />
        </View>
      )}
      {cameraPermission && (!cameraPermission?.granted || !locationPermission?.granted) && (
        <>
          <Text style={styles.text}>We need your permission to show the camera</Text>
          <TouchableOpacity
            style={styles.permissionBtn}
            onPress={getPermission}
            activeOpacity={0.8}
          >
            <Text style={styles.permissionBtnText}>GRANT PERMISSION</Text>
          </TouchableOpacity>
        </>
      )}
      {cameraPermission?.granted && locationPermission?.granted && photo && (
        <View style={styles.photoContainer}>
          <ImageBackground style={styles.photo} source={{ uri: photo }}>
            <TouchableOpacity
              style={{ ...styles.takePhotoBtn, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
              onPress={deletePhoto}
            >
              <TrashIcon width={24} height={24} fill="#FFFFFF" />
            </TouchableOpacity>
          </ImageBackground>
        </View>
      )}
      {cameraPermission?.granted && locationPermission?.granted && !photo && (
        <Camera style={styles.camera} type={CameraType.back} ref={setCamera}>
          <TouchableOpacity style={styles.takePhotoBtn} onPress={takePhoto}>
            <CameraIcon width={24} height={24} fill={'#BDBDBD'} />
          </TouchableOpacity>
        </Camera>
      )}
    </View>
  );
};

export default CameraElement;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#D3D3D3',
  },
  text: {
    marginBottom: 8,

    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
  },
  permissionBtn: {
    alignItems: 'center',

    paddingVertical: 5,
    marginHorizontal: 80,

    backgroundColor: '#FF6C00',
    borderRadius: 20,
  },
  permissionBtnText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,

    color: '#FFFFFF',
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
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  takePhotoBtn: {
    alignItems: 'center',
    justifyContent: 'center',

    width: 60,
    height: 60,

    backgroundColor: '#FFFFFF',
    fill: '#BDBDBD',
    borderRadius: 50,
  },
});
