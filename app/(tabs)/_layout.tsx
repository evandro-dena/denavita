import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Home, Camera, BookOpen, User } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import type { LucideIcon } from 'lucide-react-native';

// ─── Tab icon com spring animation ───────────────────────────────────────────

function TabIcon({ Icon, focused }: { Icon: LucideIcon; focused: boolean }) {
  const scale = useSharedValue(1);
  const dotOpacity = useSharedValue(0);

  useEffect(() => {
    if (focused) {
      // Bounce ao ativar
      scale.value = withSequence(
        withSpring(0.82, { damping: 6, stiffness: 200 }),
        withSpring(1.08, { damping: 8, stiffness: 180 }),
        withSpring(1.0, { damping: 10, stiffness: 200 })
      );
      dotOpacity.value = withSpring(1, { damping: 12 });
    } else {
      scale.value = withSpring(1, { damping: 12 });
      dotOpacity.value = withSpring(0, { damping: 12 });
    }
  }, [focused]);

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const dotAnimStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
    transform: [{ scale: dotOpacity.value }],
  }));

  return (
    <View style={styles.iconWrapper}>
      <Animated.View style={iconAnimStyle}>
        <Icon
          size={22}
          color={focused ? Colors.tabActive : Colors.tabInactive}
          strokeWidth={focused ? 2.2 : 1.8}
        />
      </Animated.View>
      <Animated.View style={[styles.dot, dotAnimStyle]} />
    </View>
  );
}

// ─── Tab Layout ───────────────────────────────────────────────────────────────

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Inter_500Medium',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ focused }) => <TabIcon Icon={Home} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ focused }) => <TabIcon Icon={Camera} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Receitas',
          tabBarIcon: ({ focused }) => <TabIcon Icon={BookOpen} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => <TabIcon Icon={User} focused={focused} />,
        }}
      />

      {/* Telas ocultas da tab bar */}
      <Tabs.Screen name="recipes/[id]" options={{ href: null }} />
      <Tabs.Screen name="diet" options={{ href: null }} />
      <Tabs.Screen name="workouts" options={{ href: null }} />
      <Tabs.Screen name="shop" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.tabActive,
  },
});
