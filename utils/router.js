import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../Screens/auth/LoginScreen';
import RegistrationScreen from '../Screens/auth/RegistrationScreen';
import PostsScreen from '../Screens/main/PostsScreen';
import CreatePostsScreen from '../Screens/main/CreatePostsScreen';
import ProfileScreen from '../Screens/main/ProfileScreen';

const AuthStack = createNativeStackNavigator();
const MainTabs = createBottomTabNavigator();

export const useRoute = isAuth => {
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
    <MainTabs.Navigator>
      <MainTabs.Screen options={{ headerShown: false }} name="Posts" component={PostsScreen} />
      <MainTabs.Screen
        options={{ headerShown: false }}
        name="CreatePosts"
        component={CreatePostsScreen}
      />
      <MainTabs.Screen options={{ headerShown: false }} name="Profile" component={ProfileScreen} />
    </MainTabs.Navigator>
  );
};
