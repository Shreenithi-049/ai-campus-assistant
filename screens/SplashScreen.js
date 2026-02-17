import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSequence,
  Easing,
  interpolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, typography } from '../constants/modernTheme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoRotation = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(30);
  const gradientRotation = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withSequence(
      withTiming(1.3, { duration: 800, easing: Easing.out(Easing.back(1.2)) }),
      withTiming(1, { duration: 300 })
    );

    logoOpacity.value = withTiming(1, { duration: 1000 });

    logoRotation.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 2000 }),
        withTiming(-5, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1
    );

    setTimeout(() => {
      taglineOpacity.value = withTiming(1, { duration: 800 });
      taglineTranslateY.value = withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
    }, 1000);

    gradientRotation.value = withRepeat(
      withTiming(360, { duration: 12000, easing: Easing.linear }),
      -1
    );

    setTimeout(() => {
      navigation.replace('Login');
    }, 4000);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotation.value}deg` },
    ],
    opacity: logoOpacity.value,
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  const gradientAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(
      gradientRotation.value,
      [0, 360],
      [0, 360]
    );
    return {
      transform: [{ rotate: `${rotateValue}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.gradientContainer, gradientAnimatedStyle]}>
        <LinearGradient
          colors={['#E0F2FE', '#BFDBFE', '#93C5FD']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>

      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Image
            source={require('../assets/IntelliCamp_logo-removebg-preview.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View style={[styles.taglineContainer, taglineAnimatedStyle]}>
          <Text style={styles.appName}>IntelliCamp</Text>
          <Text style={styles.tagline}>Smart Campus Assistant</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE',
  },
  gradientContainer: {
    position: 'absolute',
    width: width * 2,
    height: height * 2,
    left: -width / 2,
    top: -height / 2,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    width: 150,
    height: 150,
  },
  taglineContainer: {
    alignItems: 'center',
  },
  appName: {
    ...typography.h1,
    fontSize: 48,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: spacing.sm,
  },
  tagline: {
    ...typography.h4,
    color: '#1E293B', // dark slate
    fontWeight: '500',
    letterSpacing: 1,
  },
});
