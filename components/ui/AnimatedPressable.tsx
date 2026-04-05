import { Pressable, type PressableProps, StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface AnimatedPressableProps extends PressableProps {
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
  /** Escala ao pressionar. Padrão: 0.95 */
  scaleDown?: number;
  /** Habilitar haptic feedback leve. Padrão: true */
  haptic?: boolean;
}

/**
 * Pressable com animação de escala (0.95) e haptic feedback.
 * Substitui TouchableOpacity em botões primários e cards.
 */
export default function AnimatedPressable({
  onPress,
  style,
  children,
  scaleDown = 0.95,
  haptic = true,
  disabled,
  ...props
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animStyle, style as ViewStyle]}>
      <Pressable
        onPressIn={() => {
          scale.value = withTiming(scaleDown, { duration: 80 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 150 });
        }}
        onPress={async (e) => {
          if (haptic && !disabled) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          onPress?.(e);
        }}
        disabled={disabled}
        style={StyleSheet.absoluteFill.width ? undefined : { flex: 1 }}
        {...props}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
