import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import DenaVitaLogo from '@/components/ui/DenaVitaLogo';
import { Colors } from '@/constants/theme';

export default function SplashScreen() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    scale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });

    const timer = setTimeout(() => {
      router.replace('/login');
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <DenaVitaLogo width={220} wordmarkColor="#FFFFFF" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
