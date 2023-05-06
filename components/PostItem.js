import React from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';

import MessageIcon from '../assets/images/message-icon.svg';
import MapPin from '../assets/images/map-pin.svg';
import { color } from 'react-native-reanimated';

export const PostItem = item => {
  const { photo, title, id, location, locationName, comments } = item.data;
  const { navigate } = item.navigation;

  return (
    <View style={styles.postContainer}>
      <Image style={styles.postImage} source={{ uri: photo }} />
      <Text style={styles.postTitle}>{title}</Text>
      <View style={styles.postComponentsContainer}>
        <TouchableOpacity
          style={styles.componentContainer}
          onPress={() => navigate('Comments', { postId: id, photo: photo })}
        >
          <MessageIcon width={24} height={24} fill={comments > 0 ? '#FF6C00' : '#BDBDBD'} />
          <Text style={{ ...styles.commentsCount, color: comments > 0 ? '#212121' : '#BDBDBD' }}>
            {comments}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.componentContainer}
          onPress={() =>
            navigate('Map', {
              latitude: location.latitude,
              longitude: location.longitude,
            })
          }
        >
          <MapPin width={24} height={24} />
          <Text style={styles.mapLocation}>{locationName}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostItem;

const styles = StyleSheet.create({
  postContainer: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  postImage: {
    height: 240,
    width: '100%',
    borderRadius: 8,

    marginBottom: 8,
    backgroundColor: '#BDBDBD',
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
  commentsCount: {
    marginLeft: 5,

    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
  },
  mapLocation: {
    marginLeft: 4,

    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
    textDecorationLine: 'underline',

    color: '#212121',
  },
});
