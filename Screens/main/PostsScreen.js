import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';

import MessageIcon from '../../assets/images/message-icon.svg';
import MapPin from '../../assets/images/map-pin.svg';

const PostsScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  const getAllPosts = () => {
    onSnapshot(collection(db, 'posts'), data => {
      setPosts(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
  };

  useEffect(() => {
    getAllPosts();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item, indx) => indx.toString()}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Image style={styles.postImage} source={{ uri: item.photo }} />
            <Text style={styles.postTitle}>{item.title}</Text>
            <View style={styles.postComponentsContainer}>
              <TouchableOpacity
                style={styles.componentContainer}
                onPress={() => navigation.navigate('Comments')}
              >
                <MessageIcon style={{ marginRight: 6 }} width={24} height={24} />
                <Text style={styles.commentsCounter}>0</Text>
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
  );
};

export default PostsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',

    backgroundColor: '#FFFFFF',
  },
  postContainer: {
    marginHorizontal: 16,
    marginTop: 32,
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
  commentsCounter: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,

    color: '#BDBDBD',
  },
  mapLocation: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
    textDecorationLine: 'underline',

    color: '#212121',
  },
});
