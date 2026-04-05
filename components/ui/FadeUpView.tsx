import { useEffect } from 'react';
import { type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface FadeUpViewProps {
  children: React.ReactNode;
  /** Atraso em ms antes de iniciar a animação. Padrão: 0 */
  delay?: number;
  /** Duração da animação em ms. Padrão: 450 */
  duration?: number;
  /** Translação vertical inicial em px. Padrão: 24 */
  offset?: number;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Wrapper que faz fade-in + slide-up ao montar.
 * Use com delays escalonados para efeito cascata entre cards.
 *
 * @example
 * <FadeUpView delay={0}>  <CalendarCard /></FadeUpView>
 * <FadeUpView delay={100}><WeightCard /></FadeUpView>
 * <FadeUpView delay={200}><NutritionCard /></FadeUpView>
 */
export default function FadeUpView({
  children,
  delay = 0,
  duration = 450,
  offset = 24,
  style,
}: FadeUpViewProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(offset);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, { duration, easing: Easing.out(Easing.cubic) });
      translateY.value = withTiming(0, { duration, easing: Easing.out(Easing.cubic) });
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[animStyle, style]}>
      {children}
    </Animated.View>
  );
}
