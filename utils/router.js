import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../Screens/auth/LoginScreen';
import RegistrationScreen from '../Screens/auth/RegistrationScreen';
import CommentsScreen from '../Screens/main/CommentsScreen';
import Home from '../Screens/main/Home';
import MapScreen from '../Screens/main/MapScreen';
import GoBackButton from '../components/GoBackButton';

import { auth } from '../firebase/config';

const AuthStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

export const useRoute = isAuth => {
  const { isLoading } = useSelector(state => state.auth);

  if (isLoading && !auth.currentUser) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator color="#FF6C00" size={110} />
      </View>
    );
  }

  if (!isAuth) {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          options={{ headerShown: false }}
          name="Register"
          component={RegistrationScreen}
        />
        <AuthStack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
      </AuthStack.Navigator>
    );
  }
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen
        name="Comments"
        component={CommentsScreen}
        options={({ navigation }) => ({
          headerBackVisible: false,
          headerLeft: () => (
            <View>
              <GoBackButton navigation={navigation} />
            </View>
          ),
          headerTitle: 'Комментарии',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Roboto-Medium',
            fontSize: 17,
            lineHeight: 22,
            letterSpacing: -0.408,

            color: '#212121',
          },
        })}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={({ navigation }) => ({
          headerBackVisible: false,
          headerLeft: () => (
            <View>
              <GoBackButton navigation={navigation} />
            </View>
          ),
          headerTitle: 'Карта',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Roboto-Medium',
            fontSize: 17,
            lineHeight: 22,
            letterSpacing: -0.408,

            color: '#212121',
          },
        })}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
