import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import PostsScreen from './PostsScreen';
import CreatePostsScreen from './CreatePostsScreen';
import ProfileScreen from './ProfileScreen';
import LogoutButton from '../../components/LogoutButton';
import GoBackButton from '../../components/GoBackButton';

import PostsIcon from '../../assets/images/posts-icon.svg';
import CreateIcon from '../../assets/images/add-icon.svg';
import ProfileIcon from '../../assets/images/user-icon.svg';

const MainTabs = createBottomTabNavigator();

const Home = ({ navigation }) => {
  return (
    <MainTabs.Navigator initialRouteName="Posts" screenOptions={{ ...baseOptions }}>
      <MainTabs.Screen
        options={{
          ...baseTabBarOptions,
          headerTitle: 'Публикации',
          headerRight: () => (
            <View style={{ marginRight: 16 }}>
              <LogoutButton />
            </View>
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
            <View style={{ marginLeft: 16 }}>
              <GoBackButton navigation={navigation} />
            </View>
          ),
          tabBarIcon: ({ color }) => <CreateIcon name="Create posts" stroke={color} />,
          tabBarItemStyle: { ...baseTabBarOptions.tabBarItemStyle, marginRight: 15 },
          tabBarStyle: { position: 'absolute', bottom: -60 },
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

export default Home;

const baseOptions = {
  headerTitleAlign: 'center',
  headerStyle: {},
  headerTitleStyle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
    lineHeight: 22,

    textAlign: 'center',
    letterSpacing: -0.408,

    color: '#212121',
  },
  tabBarShowLabel: false,
  tabBarStyle: {
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
    marginVertical: 5,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
};
