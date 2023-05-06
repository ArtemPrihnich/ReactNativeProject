import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { collection, onSnapshot } from 'firebase/firestore';

import { db } from '../../firebase/config';
import { useKeyboard } from '../../utils/keyboardActive';
import { uploadComment, updateCommentsCount } from '../../services/API';

import SendIcon from '../../assets/images/send-icon.svg';
import UserIcon from '../../assets/images/user-icon.svg';

const CommentsScreen = ({ route }) => {
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allComments, setAllComments] = useState([]);

  const { postId, photo } = route.params;
  const { nickName, userPhoto } = useSelector(state => state.auth);
  const { isKeyboardActive } = useKeyboard();
  const toast = useToast();

  const commentsRef = collection(db, 'posts', postId, 'comments');

  useEffect(() => {
    const unsubscribe = onSnapshot(commentsRef, data => {
      setAllComments(
        data.docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => b.time - a.time)
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const sendComment = async () => {
    try {
      setIsLoading(true);
      await uploadComment(commentsRef, comment, nickName, userPhoto, toast);
      setComment('');
      await updateCommentsCount(postId);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screenContainer}>
      {!isKeyboardActive && <Image style={styles.postPhoto} source={{ uri: photo }} />}
      <FlatList
        data={allComments}
        keyExtractor={item => item.id}
        inverted={true}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <View style={styles.userInfoContainer}>
              <View style={styles.userPhotoContainer}>
                {!item.userPhoto && <UserIcon width={28} height={28} fill={'#BDBDBD'} />}
                {item.userPhoto && (
                  <Image style={styles.userPhoto} source={{ uri: item.userPhoto }} />
                )}
              </View>
              <Text style={styles.userNickName}>{item.nickName}</Text>
            </View>
            <View style={styles.commentInfoContainer}>
              <Text style={styles.comment}>{item.comment}</Text>
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
        <TouchableOpacity style={styles.submitBtn} onPress={sendComment}>
          {!isLoading && <SendIcon width={34} height={34} />}
          {isLoading && <ActivityIndicator color="#FFFFFF" size={24} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentsScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'flex-end',

    marginHorizontal: 16,
  },
  postPhoto: {
    marginTop: 16,
    marginBottom: 16,

    height: 240,
    width: '100%',

    borderRadius: 8,
  },
  commentContainer: {
    marginBottom: 14,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 5,
  },
  userPhotoContainer: {
    marginRight: 8,

    borderWidth: 1,
    borderRadius: 50,
    borderColor: '#BDBDBD',
  },
  userPhoto: {
    width: 28,
    height: 28,

    borderRadius: 50,
  },
  userNickName: {
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.5,

    color: '#212121',
  },
  commentInfoContainer: {
    marginLeft: 28,
    paddingHorizontal: 16,
    paddingVertical: 8,

    backgroundColor: '#D3D3D3',

    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 6,
  },
  comment: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    lineHeight: 19,

    color: '#212121',
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
  submitBtn: {
    justifyContent: 'center',
    alignItems: 'center',

    position: 'absolute',
    top: '50%',
    right: 8,

    width: 34,
    height: 34,

    transform: [{ translateY: -17 }],

    backgroundColor: '#FF6C00',
    borderRadius: 50,
  },
});
