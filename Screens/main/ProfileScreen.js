import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import LogoutButton from '../../components/LogoutButton';
import AddImage from '../../assets/images/add-image.svg';
import { db, auth } from '../../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useSelector } from 'react-redux';

import MessageIcon from '../../assets/images/message-icon.svg';
import MapPin from '../../assets/images/map-pin.svg';

const ProfileScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const { userId, nickName } = useSelector(state => state.auth);

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

  return (
    <ImageBackground style={styles.image} source={require('../../assets/images/bgImage.jpg')}>
      <View style={styles.profileContainer}>
        <View style={styles.imgBox}>
          <TouchableOpacity style={styles.addImgBtn}>
            <AddImage width={25} height={25} />
          </TouchableOpacity>
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
  image: {
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
    position: 'absolute',
    top: -60,
    left: '50%',
    transform: [{ translateX: -60 }],
    width: 120,
    height: 120,
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
  },
  addImgBtn: {
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
