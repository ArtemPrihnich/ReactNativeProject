import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  FlatList,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { db } from '../../firebase/config';
import { doc, collection, setDoc, onSnapshot, addDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { useKeyboard } from '../../utils/keyboardActive';
import SendIcon from '../../assets/images/send-icon.svg';
import UserIcon from '../../assets/images/user-icon.svg';

const CommentsScreen = ({ route }) => {
  let flatList;
  const { postId, photo } = route.params;
  const { nickName } = useSelector(state => state.auth);

  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([]);
  console.log(allComments);

  const keyboardIsActive = useKeyboard();

  // const commentsRef = doc(collection(db, 'posts', postId, 'comments'));
  const commentsRef = collection(db, 'posts', postId, 'comments');

  const sendComment = async () => {
    try {
      await addDoc(commentsRef, { comment, nickName, time: Date.now() });
      setComment('');
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(commentsRef, data => {
      setAllComments(
        data.docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => a.time - b.time)
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={{ flex: 1, marginHorizontal: 16 }}>
      <Image
        style={{ ...styles.postPhoto, height: keyboardIsActive ? 0 : 240 }}
        source={{ uri: photo }}
      />
      <FlatList
        data={allComments}
        ref={ref => {
          flatList = ref;
        }}
        keyExtractor={item => item.id}
        onContentSizeChange={() => flatList.scrollToEnd({ animated: true })}
        onLayout={() => flatList.scrollToEnd({ animated: false })}
        renderItem={({ item }) => (
          <View style={styles.commentCont}>
            <View style={styles.userInfo}>
              <View style={styles.userPhotoBox}>
                <UserIcon width={28} height={28} fill={'#BDBDBD'} />
              </View>
              <Text style={styles.userNickName}>{item.nickName}</Text>
            </View>
            <View style={styles.textBox}>
              <Text style={styles.comment}>{item.comment}</Text>
              {/* <Text>{new Date(item.time).toLocaleTimeString('ua-UA')}</Text> */}
              <Text style={styles.date}>
                {new Date(item.time).toLocaleString('ua-UA', {
                  day: 'numeric',
                  month: 'numeric',
                  year: '2-digit',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </Text>
            </View>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Комментировать..."
          style={styles.input}
          value={comment}
          onChangeText={setComment}
        />
        <TouchableOpacity style={styles.button} onPress={sendComment}>
          <SendIcon width={34} height={34} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentsScreen;

const styles = StyleSheet.create({
  commentCont: {
    marginBottom: 14,
  },
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  postPhoto: {
    marginTop: 16,
    marginBottom: 16,
    // height: 240,
    width: '100%',

    borderRadius: 8,
  },
  commentsContainer: {
    // flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 5,
  },
  userPhotoBox: {
    marginRight: 8,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: '#BDBDBD',
  },
  userNickName: {
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.5,

    color: '#212121',
  },
  textBox: {
    marginLeft: 28,
    paddingHorizontal: 16,
    paddingVertical: 8,

    backgroundColor: '#D3D3D3',

    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 6,
  },
  comment: {
    // marginLeft: 28,
    // paddingHorizontal: 16,
    // paddingVertical: 8,

    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    lineHeight: 19,

    color: '#212121',
    // backgroundColor: '#D3D3D3',

    // borderTopRightRadius: 6,
    // borderBottomRightRadius: 6,
    // borderBottomLeftRadius: 6,
  },
  date: {
    textAlign: 'right',
    fontFamily: 'Roboto-Regular',
    fontSize: 10,
    lineHeight: 15,

    color: '#696969',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    paddingLeft: 16,
    paddingRight: 50,
    paddingVertical: 10,

    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,

    color: '#212121',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',

    borderWidth: 1,
    borderRadius: 100,
    borderColor: '#BDBDBD',
  },
  button: {
    position: 'absolute',
    top: '50%',
    right: 8,
    transform: [{ translateY: -17 }],
  },
});
