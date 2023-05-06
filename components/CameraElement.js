import React, { useEffect, useState } from 'react';
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
  const [cameraPermission, setCameraPermission] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [camera, setCamera] = useState(null);

  const getPermission = async () => {
    const camera = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(camera.status === 'granted');
    const location = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(location.status === 'granted');
  };

  useEffect(() => {
    (async () => {
      const camera = await Camera.getCameraPermissionsAsync();
      setCameraPermission(camera.status === 'granted');
      const location = await Location.getForegroundPermissionsAsync();
      setLocationPermission(location.status === 'granted');
    })();
  }, []);

  const takePhoto = async () => {
    const makePhoto = await camera.takePictureAsync();
    writePhoto(makePhoto.uri);
    setLocationState(true);
    const getLocation = await Location.getLastKnownPositionAsync();
    writeLocation(getLocation.coords);
    setLocationState(false);
  };

  const deletePhoto = () => {
    writePhoto(null);
    writeLocation(null);
  };

  if (cameraPermission === null || locationPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} color="#FF6C00" />
      </View>
    );
  }

  if (cameraPermission === false || locationPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={getPermission} activeOpacity={0.8}>
          <Text style={styles.permissionBtnText}>GRANT PERMISSION</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      {photo && (
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
      {!photo && (
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
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  permissionText: {
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
