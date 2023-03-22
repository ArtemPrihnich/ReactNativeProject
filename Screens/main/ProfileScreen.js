import React from 'react';
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, Image } from 'react-native';
import LogoutButton from '../../components/LogoutButton';

const ProfileScreen = () => {
  return (
    <ImageBackground style={styles.image} source={require('../../assets/images/bgImage.jpg')}>
      <View style={styles.profileContainer}>
        <View style={styles.imgBox}>
          <TouchableOpacity style={styles.addImgBtn}>
            <Image source={require('../../assets/images/addIcon.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.logoutBtnBox}>
          <LogoutButton />
        </View>
        <View style={styles.userInfoBox}>
          <Text style={styles.userName}>Artem Prihnich</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingBottom: 78,
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
});
