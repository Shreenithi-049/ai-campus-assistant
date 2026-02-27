import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { BottomNavigation } from './components/BottomNavigation';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Screens
import SplashScreen from './screens/SplashScreen';
import ModernLoginScreen from './screens/ModernLoginScreen';
import ModernSignupScreen from './screens/ModernSignupScreen';
import ModernHomeScreen from './screens/ModernHomeScreen';
import ModernChatScreen from './screens/ModernChatScreen';
import ModernMapScreen from './screens/ModernMapScreen';
import ModernEventsScreen from './screens/ModernEventsScreen';
import ModernProfileScreen from './screens/ModernProfileScreen';
import ModernAcademicScreen from './screens/ModernAcademicScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import SecurityScreen from './screens/SecurityScreen';
import HelpScreen from './screens/HelpScreen';
import EventRegistrationScreen from './screens/EventRegistrationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavigation {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={ModernHomeScreen} />
      <Tab.Screen name="Chat" component={ModernChatScreen} />
      <Tab.Screen name="Map" component={ModernMapScreen} />
      <Tab.Screen name="Academic" component={ModernAcademicScreen} />
      <Tab.Screen name="Events" component={ModernEventsScreen} />
      <Tab.Screen name="Profile" component={ModernProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  const { isAuthenticated, loading } = useAuth();
  const [initialRoute, setInitialRoute] = React.useState('Splash');

  React.useEffect(() => {
    // After initial load, skip splash on subsequent auth changes
    if (!loading && !isAuthenticated && initialRoute === 'Splash') {
      setInitialRoute('Login');
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          {initialRoute === 'Splash' && (
            <Stack.Screen name="Splash" component={SplashScreen} />
          )}
          <Stack.Screen name="Login" component={ModernLoginScreen} />
          <Stack.Screen name="Signup" component={ModernSignupScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainApp" component={MainTabs} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Security" component={SecurityScreen} />
          <Stack.Screen name="Help" component={HelpScreen} />
          <Stack.Screen name="EventRegistration" component={EventRegistrationScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default AppNavigator;