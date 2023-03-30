import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PostsScreen = ({ route }) => {
  console.log(route.params);
  return (
    <View style={styles.container}>
      <Text>PostsScreen</Text>
    </View>
  );
};

export default PostsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#FFFFFF',
  },
});
