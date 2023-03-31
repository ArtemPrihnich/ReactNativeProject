import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../Screens/auth/LoginScreen';
import RegistrationScreen from '../Screens/auth/RegistrationScreen';
import CommentsScreen from '../Screens/main/CommentsScreen';
import CreatePostsScreen from '../Screens/main/CreatePostsScreen';
import Home from '../Screens/main/Home';
import MapScreen from '../Screens/main/MapScreen';

const AuthStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

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
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Comments" component={CommentsScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
    </Stack.Navigator>
  );
};
