import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList } from 'react-native';
import { db } from '../../firebase/config';
import { doc, collection, setDoc, onSnapshot, addDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';

const CommentsScreen = ({ route }) => {
  const { postId } = route.params;
  // console.log(postId);
  const { nickName } = useSelector(state => state.auth);

  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([]);
  console.log(allComments);

  // const commentsRef = doc(collection(db, 'posts', postId, 'comments'));
  const commentsRef = collection(db, 'posts', postId, 'comments');

  const sendComment = async () => {
    try {
      await addDoc(commentsRef, { comment, nickName });
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAllComments = () => {
    onSnapshot(commentsRef, data => {
      console.log(data);
      setAllComments(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
  };

  useEffect(() => {
    getAllComments();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.commentsContainer}>
          <FlatList
            data={allComments}
            renderItem={({ item }) => (
              <View style={styles.commentCont}>
                <Text>{item.nickName}</Text>
                <Text>{item.comment}</Text>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        </View>
        <View style={styles}>
          <TextInput style={styles.input} onChangeText={setComment} />
          <Button onPress={sendComment} title="Send"></Button>
        </View>
      </View>
    </View>
  );
};

export default CommentsScreen;

const styles = StyleSheet.create({
  commentCont: {
    backgroundColor: 'lightgray',
  },
  container: {
    flex: 1,
  },
  commentsContainer: {
    flex: 1,
  },
  form: {
    flex: 1,
    // justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    borderColor: 'blue',
  },
});
