import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';

import LoginScreen from '../Screens/auth/LoginScreen';
import RegistrationScreen from '../Screens/auth/RegistrationScreen';
import PostsScreen from '../Screens/main/PostsScreen';
import CreatePostsScreen from '../Screens/main/CreatePostsScreen';
import ProfileScreen from '../Screens/main/ProfileScreen';
import LogOut from '../assets/images/log-out.svg';
import ArrowLeft from '../assets/images/arrow-left.svg';
import PostsIcon from '../assets/images/posts.svg';
import CreateIcon from '../assets/images/add.svg';
import ProfileIcon from '../assets/images/user.svg';

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
    <MainTabs.Navigator screenOptions={{ ...baseOptions }}>
      <MainTabs.Screen
        options={{
          ...baseTabBarOptions,
          headerTitle: 'Публикации',
          headerRight: () => (
            <TouchableOpacity style={{ marginRight: 16 }}>
              <LogOut width={24} height={24} />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => <PostsIcon name="Posts" stroke={color} />,
          tabBarItemStyle: { ...baseTabBarOptions.tabBarItemStyle, marginRight: 15 },
        }}
        name="Posts"
        component={PostsScreen}
      />
      <MainTabs.Screen
        options={{
          ...baseTabBarOptions,
          headerTitle: 'Создать Публикацию',
          headerLeft: () => (
            <TouchableOpacity style={{ marginLeft: 16 }}>
              <ArrowLeft width={24} height={24} />
            </TouchableOpacity>
          ),
          headerLeftContainerStyle: {
            bottom: 10,
          },
          tabBarIcon: ({ color }) => <CreateIcon name="Create posts" stroke={color} />,
          tabBarItemStyle: { ...baseTabBarOptions.tabBarItemStyle, marginRight: 15 },
        }}
        name="CreatePosts"
        component={CreatePostsScreen}
      />
      <MainTabs.Screen
        options={{
          ...baseTabBarOptions,
          headerShown: false,
          tabBarIcon: ({ color }) => <ProfileIcon name="Profile" stroke={color} />,
        }}
        name="Profile"
        component={ProfileScreen}
      />
    </MainTabs.Navigator>
  );
};

const baseOptions = {
  headerTitleAlign: 'center',
  headerStyle: {
    height: 88,
    borderBottomWidth: 1,
  },
  headerTitleStyle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
    lineHeight: 22,

    textAlign: 'center',
    letterSpacing: -0.408,

    color: '#212121',
  },
  headerTitleContainerStyle: {
    bottom: 10,
  },
  headerRightContainerStyle: {
    bottom: 10,
  },
  tabBarShowLabel: false,
  tabBarStyle: {
    height: 60,
    alignItems: 'center',
    borderTopWidth: 1,
  },
};

const baseTabBarOptions = {
  tabBarActiveTintColor: '#FFFFFF',
  tabBarInactiveTintColor: '#212121',
  tabBarActiveBackgroundColor: '#FF6C00',
  tabBarItemStyle: {
    maxHeight: 40,
    maxWidth: 70,
    marginTop: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
};
