import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { Leaf } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

export default function SplashScreen() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    // Fade in + scale up em 500ms
    opacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
    scale.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });

    // Navega para login após 2s
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoWrapper, animatedStyle]}>
        {/* Ícone folha */}
        <View style={styles.leafContainer}>
          <Leaf size={48} color={Colors.accent} strokeWidth={1.5} />
        </View>

        {/* Wordmark */}
        <View style={styles.wordmark}>
          <Text style={styles.logoText}>
            <Text style={styles.logoAccent}>Dena</Text>
            <Text style={styles.logoWhite}>Vita</Text>
          </Text>
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>Nutrição que transforma</Text>
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
  logoWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  leafContainer: {
    marginBottom: 4,
  },
  wordmark: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 40,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: -0.5,
  },
  logoAccent: {
    color: Colors.accent,
  },
  logoWhite: {
    color: Colors.text,
  },
  tagline: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    letterSpacing: 0.3,
    marginTop: 4,
  },
});
