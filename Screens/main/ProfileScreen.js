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
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import * as ImagePicker from 'expo-image-picker';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

import { db } from '../../firebase/config';
import { changeUserPhoto } from '../../redux/auth/authOperations';

import LogoutButton from '../../components/LogoutButton';
import { PostItem } from '../../components/PostItem';

import PlusIcon from '../../assets/images/plus-icon.svg';

const ProfileScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userId, nickName, userPhoto, isLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const toast = useToast();

  const q = query(collection(db, 'posts'), where('userId', '==', userId));

  useEffect(() => {
    const unsubscribe = onSnapshot(q, data => {
      setPosts(
        data.docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => b.time - a.time)
      );
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const addUserPhoto = async () => {
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
  };

  const deleteUserPhoto = async () => {
    dispatch(changeUserPhoto(null, toast));
  };

  return (
    <ImageBackground style={styles.bgImage} source={require('../../assets/images/bgImage.jpg')}>
      <View style={styles.screenContainer}>
        <View style={styles.imgContainer}>
          {isLoading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size={60} color="#FF6C00" />
            </View>
          )}
          <Image
            style={{ ...styles.photo, opacity: isLoading ? 0.5 : 1 }}
            source={{ uri: userPhoto }}
          />
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
        <View style={styles.logoutBtnContainer}>
          <LogoutButton />
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{nickName}</Text>
        </View>
        <View style={styles.userPostsContainer}>
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            data={posts}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <>
                {!loading && (
                  <View style={styles.emptyPostsContainer}>
                    <Text style={styles.emptyPostsText}>
                      У вас нет постов, самое время сделать один!
                    </Text>
                  </View>
                )}
              </>
            }
            renderItem={({ item }) => <PostItem data={item} navigation={navigation} />}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-start',
  },
  screenContainer: {
    flex: 1,

    position: 'relative',

    marginTop: 120,
    paddingTop: 92,

    backgroundColor: '#ffffff',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  imgContainer: {
    alignContent: 'center',

    position: 'absolute',
    top: -60,
    left: '50%',

    width: 120,
    height: 120,

    transform: [{ translateX: -60 }],

    backgroundColor: '#F6F6F6',
    borderRadius: 16,
  },
  loaderContainer: {
    justifyContent: 'center',

    position: 'absolute',

    height: '100%',
    width: '100%',

    zIndex: 2,
  },
  photo: {
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
  logoutBtnContainer: {
    position: 'absolute',
    right: 16,
    top: 22,
  },
  userInfoContainer: {
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

  userPostsContainer: {
    flex: 1,

    paddingTop: 32,
    paddingBottom: 32,
  },
  emptyPostsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPostsText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 25,
    lineHeight: 30,
    textAlign: 'center',
    letterSpacing: 0.01,

    color: '#A9A9A9',
  },
});
