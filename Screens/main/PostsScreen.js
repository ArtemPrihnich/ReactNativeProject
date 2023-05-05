import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';

import { PostItem } from '../../components/PostItem';

const PostsScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'posts'), data => {
      setPosts(
        data.docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => b.time - a.time)
      );
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <View style={styles.screenContainer}>
      <FlatList
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
  );
};

export default PostsScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingTop: 32,

    backgroundColor: '#FFFFFF',
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
