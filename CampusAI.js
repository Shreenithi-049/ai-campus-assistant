import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, StyleSheet, Platform, Dimensions, useWindowDimensions } from 'react-native';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MobileBottomNav, WebSidebar, WebTopHeader } from './components/AppShell';
import { getTheme } from './constants/modernTheme';

import ModernLoginScreen        from './screens/ModernLoginScreen';
import ModernSignupScreen       from './screens/ModernSignupScreen';
import EmailVerificationScreen  from './screens/EmailVerificationScreen';
import ModernHomeScreen         from './screens/ModernHomeScreen';
import ModernChatScreen         from './screens/ModernChatScreen';
import ModernMapScreen          from './screens/ModernMapScreen';
import ModernEventsScreen       from './screens/ModernEventsScreen';
import ModernProfileScreen      from './screens/ModernProfileScreen';
import ModernAcademicScreen     from './screens/ModernAcademicScreen';
import EditProfileScreen        from './screens/EditProfileScreen';
import SecurityScreen           from './screens/SecurityScreen';
import HelpScreen               from './screens/HelpScreen';
import EventRegistrationScreen  from './screens/EventRegistrationScreen';
import { sidebarState }         from './utils/layoutState';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

const IS_WEB  = Platform.OS === 'web';

const SCREEN_META = {
  Home:     { title: 'Dashboard',    subtitle: "Welcome back! Here's what's happening on campus." },
  Chat:     { title: 'AI Assistant', subtitle: 'Ask me anything about campus life.' },
  Map:      { title: 'Campus Map',   subtitle: 'Navigate your campus with ease.' },
  Academic: { title: 'Academic',     subtitle: 'Your timetable, syllabus and attendance.' },
  Events:   { title: 'Events',       subtitle: 'Upcoming campus events and activities.' },
  Profile:  { title: 'Profile',      subtitle: 'Manage your account and preferences.' },
};

// ─── Custom tab bar: sidebar on wide web, bottom nav on mobile/narrow ─────────
function AppTabBar(props) {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);
  const { state, navigation } = props;
  const { width } = useWindowDimensions();
  const IS_WIDE = IS_WEB && width >= 768;

  if (IS_WIDE) {
    // On wide web the sidebar IS the tab bar — render it as a fixed left panel
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 200, display: 'flex', flexDirection: 'column',
      }}>
        <WebSidebar state={state} navigation={navigation} />
      </div>
    );
  }

  return <MobileBottomNav state={state} navigation={navigation} />;
}

// ─── Wide web content wrapper (header only, sidebar is in tab bar) ────────────
function WideContentWrapper({ children, routeName }) {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);
  const meta = SCREEN_META[routeName] ?? { title: routeName, subtitle: '' };
  
  const [isCollapsed, setIsCollapsed] = React.useState(sidebarState.collapsed);
  React.useEffect(() => {
    return sidebarState.subscribe(setIsCollapsed);
  }, []);

  const { width } = useWindowDimensions();
  const IS_WIDE = IS_WEB && width >= 768;

  if (!IS_WIDE) return children;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden',
      backgroundColor: theme.background,
      paddingLeft: isCollapsed ? 68 : 240,
      transition: 'padding-left 0.22s ease'
    }}>
      <WebTopHeader title={meta.title} subtitle={meta.subtitle} />
      <main style={{ flex: 1, overflowY: 'auto', backgroundColor: theme.background }}>
        {children}
      </main>
    </div>
  );
}

// ─── HOC: wraps each screen with WideContentWrapper on web ───────────────────
function withWideLayout(ScreenComponent, routeName) {
  return function WrappedScreen(props) {
    return (
      <WideContentWrapper routeName={routeName}>
        <ScreenComponent {...props} />
      </WideContentWrapper>
    );
  };
}

const WrappedHome        = withWideLayout(ModernHomeScreen,     'Home');
const WrappedChat        = withWideLayout(ModernChatScreen,     'Chat');
const WrappedMap         = withWideLayout(ModernMapScreen,      'Map');
const WrappedAcademic    = withWideLayout(ModernAcademicScreen, 'Academic');
const WrappedEvents      = withWideLayout(ModernEventsScreen,   'Events');
const WrappedProfile     = withWideLayout(ModernProfileScreen,  'Profile');
const WrappedEditProfile = withWideLayout(EditProfileScreen,    'Profile');
const WrappedSecurity    = withWideLayout(SecurityScreen,       'Profile');
const WrappedHelp        = withWideLayout(HelpScreen,           'Profile');

// ─── Main tabs ────────────────────────────────────────────────────────────────
function MainTabs() {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);
  const { width } = useWindowDimensions();
  const IS_WIDE = IS_WEB && width >= 768;

  return (
    <View style={[{ flex: 1, backgroundColor: theme.background }, IS_WIDE && { flexDirection: 'row' }]}>
      <Tab.Navigator
        tabBar={(props) => <AppTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Home"     component={WrappedHome} />
        <Tab.Screen name="Chat"     component={WrappedChat} />
        <Tab.Screen name="Map"      component={WrappedMap} />
        <Tab.Screen name="Academic" component={WrappedAcademic} />
        <Tab.Screen name="Events"   component={WrappedEvents} />
        <Tab.Screen name="Profile"  component={WrappedProfile} />
      </Tab.Navigator>
    </View>
  );
}

// ─── Auth navigator ───────────────────────────────────────────────────────────
function AuthNavigator() {
  const { isAuthenticated, isEmailVerified, loading, isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login"  component={ModernLoginScreen} />
          <Stack.Screen name="Signup" component={ModernSignupScreen} />
        </>
      ) : !isEmailVerified ? (
        <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
      ) : (
        <>
          <Stack.Screen name="MainApp"           component={MainTabs} />
          <Stack.Screen name="EditProfile"       component={WrappedEditProfile} />
          <Stack.Screen name="Security"          component={WrappedSecurity} />
          <Stack.Screen name="Help"              component={WrappedHelp} />
          <Stack.Screen name="EventRegistration" component={EventRegistrationScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
