import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Meal } from '@/types';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import MealItemRow from './MealItemRow';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface MealCardProps {
  meal: Meal;
}

interface InlineMacroChipProps {
  label: string;
  value: string;
  color: string;
}

function InlineMacroChip({ label, value, color }: InlineMacroChipProps) {
  return (
    <View style={[styles.chip, { backgroundColor: `${color}18` }]}>
      <Text style={[styles.chipLabel, { color }]}>{label}</Text>
      <Text style={[styles.chipValue, { color }]}> {value}</Text>
    </View>
  );
}

export default function MealCard({ meal }: MealCardProps) {
  const [expanded, setExpanded] = useState(false);
  const chevronAnim = useRef(new Animated.Value(0)).current;

  const totalCalories = meal.items.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = meal.items.reduce((sum, item) => sum + item.protein, 0);
  const totalCarbs = meal.items.reduce((sum, item) => sum + item.carbs, 0);
  const totalFat = meal.items.reduce((sum, item) => sum + item.fat, 0);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    LayoutAnimation.configureNext({
      duration: 260,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut' },
    });

    Animated.timing(chevronAnim, {
      toValue: expanded ? 0 : 1,
      duration: 240,
      useNativeDriver: true,
    }).start();

    setExpanded((prev) => !prev);
  };

  const chevronRotate = chevronAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={handleToggle} activeOpacity={0.75}>
        <View style={styles.headerLeft}>
          <View style={styles.timeBadge}>
            <Text style={styles.timeText}>{meal.time}</Text>
          </View>
          <View>
            <Text style={styles.mealName}>{meal.name}</Text>
            <Text style={styles.itemCount}>{meal.items.length} alimentos</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.calories}>{totalCalories} kcal</Text>
          <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
            <Ionicons name="chevron-down" size={18} color={Colors.textMuted} />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <View style={styles.divider} />

          <View style={styles.macroRow}>
            <InlineMacroChip label="P" value={`${totalProtein}g`} color="#60A5FA" />
            <InlineMacroChip label="C" value={`${totalCarbs}g`} color="#FBBF24" />
            <InlineMacroChip label="G" value={`${totalFat}g`} color="#F87171" />
          </View>

          <View style={styles.itemsList}>
            {meal.items.map((item) => (
              <MealItemRow key={item.id} item={item} />
            ))}
          </View>

          {meal.substitution && (
            <View style={styles.substitution}>
              <Ionicons name="swap-horizontal-outline" size={14} color={Colors.primaryLight} />
              <Text style={styles.substitutionText}>{meal.substitution}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  timeBadge: {
    backgroundColor: Colors.primaryFaded,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    minWidth: 52,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryLight,
  },
  mealName: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  itemCount: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  calories: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginBottom: Spacing.sm,
  },
  macroRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  chipLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  chipValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemsList: {
    marginTop: Spacing.xs,
  },
  substitution: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    backgroundColor: Colors.primaryFaded,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  substitutionText: {
    flex: 1,
    ...Typography.caption,
    color: Colors.primaryLight,
    lineHeight: 18,
  },
});
