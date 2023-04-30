import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import LogoutButton from '../../components/LogoutButton';
import PlusIcon from '../../assets/images/plus-icon.svg';
import { db, cloudStorage } from '../../firebase/config';
import { ref, deleteObject } from 'firebase/storage';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { changeUserPhoto, uploadUserPhoto } from '../../redux/auth/authOperations';
import { useToast } from 'react-native-toast-notifications';

import MessageIcon from '../../assets/images/message-icon.svg';
import MapPin from '../../assets/images/map-pin.svg';

const ProfileScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const { userId, nickName, userPhoto, isLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const toast = useToast();

  const q = query(collection(db, 'posts'), where('userId', '==', userId));

  useEffect(() => {
    const unsubscribe = onSnapshot(q, data => {
      setPosts(
        data.docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => b.time - a.time)
      );
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const addUserPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
      const userPhoto = await ImagePicker.launchImageLibraryAsync();
      if (userPhoto.canceled) {
        return;
      }
      const photoPath = userPhoto.assets[0].uri;
      dispatch(changeUserPhoto(photoPath, toast));
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteUserPhoto = async () => {
    try {
      dispatch(changeUserPhoto(null, toast));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <ImageBackground style={styles.bgImage} source={require('../../assets/images/bgImage.jpg')}>
      <View style={styles.profileContainer}>
        <View style={styles.imgBox}>
          {isLoading && (
            <View style={styles.loaderBox}>
              <ActivityIndicator size={60} color="#FF6C00" />
            </View>
          )}
          <Image
            style={{ ...styles.image, opacity: isLoading ? 0.5 : 1 }}
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
        <View style={styles.logoutBtnBox}>
          <LogoutButton />
        </View>
        <View style={styles.userInfoBox}>
          <Text style={styles.userName}>{nickName}</Text>
        </View>
        <View style={styles.userPostsContainer}>
          <FlatList
            data={posts}
            // contentContainerStyle={{ marginBottom: 32 }}
            keyExtractor={(item, indx) => indx.toString()}
            renderItem={({ item }) => (
              <View style={styles.postContainer}>
                <Image style={styles.postImage} source={{ uri: item.photo }} />
                <Text style={styles.postTitle}>{item.title}</Text>
                <View style={styles.postComponentsContainer}>
                  <TouchableOpacity
                    style={styles.componentContainer}
                    onPress={() =>
                      navigation.navigate('Comments', { postId: item.id, photo: item.photo })
                    }
                  >
                    <MessageIcon style={{ marginRight: 6 }} width={24} height={24} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.componentContainer}
                    onPress={() =>
                      navigation.navigate('Map', {
                        latitude: item.location.latitude,
                        longitude: item.location.longitude,
                      })
                    }
                  >
                    <MapPin style={{ marginRight: 4 }} width={24} height={24} />
                    <Text style={styles.mapLocation}>{item.locationName}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-start',
  },
  profileContainer: {
    flex: 1,
    position: 'relative',
    marginTop: 120,
    paddingTop: 92,
    backgroundColor: '#ffffff',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  imgBox: {
    alignContent: 'center',
    position: 'absolute',
    top: -60,
    left: '50%',
    transform: [{ translateX: -60 }],
    width: 120,
    height: 120,
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
  },
  loaderBox: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    zIndex: 2,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
    borderRadius: 16,
  },
  buttonBox: {
    position: 'absolute',
    bottom: 14,
    right: -12.5,
    width: 25,
    height: 25,
  },
  logoutBtnBox: {
    position: 'absolute',
    right: 16,
    top: 22,
  },
  userInfoBox: {
    marginHorizontal: 16,
  },
  userName: {
    fontFamily: 'Roboto-Medium',
    fontSize: 30,
    lineHeight: 35,
    textAlign: 'center',
    letterSpacing: 0.01,

    color: '#212121',
  },

  /////////////////////////////////////////////

  userPostsContainer: {
    paddingTop: 32,
    paddingBottom: 32,
  },
  postContainer: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  postImage: {
    height: 240,
    width: '100%',
    borderRadius: 8,

    marginBottom: 8,
  },
  postTitle: {
    marginBottom: 8,

    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    lineHeight: 19,

    color: '#212121',
  },
  postComponentsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  componentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapLocation: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
    textDecorationLine: 'underline',

    color: '#212121',
  },
});
