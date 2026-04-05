import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DietPlan } from '@/types';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

interface DailyMacroSummaryProps {
  plan: DietPlan;
}

interface MacroCardData {
  label: string;
  value: string;
  color: string;
  bg: string;
}

export default function DailyMacroSummary({ plan }: DailyMacroSummaryProps) {
  const macros: MacroCardData[] = [
    {
      label: 'Calorias',
      value: `${plan.totalCalories} kcal`,
      color: Colors.primaryLight,
      bg: Colors.primaryFaded,
    },
    {
      label: 'Proteína',
      value: `${plan.totalProtein}g`,
      color: '#60A5FA',
      bg: 'rgba(96, 165, 250, 0.12)',
    },
    {
      label: 'Carboidratos',
      value: `${plan.totalCarbs}g`,
      color: '#FBBF24',
      bg: 'rgba(251, 191, 36, 0.12)',
    },
    {
      label: 'Gordura',
      value: `${plan.totalFat}g`,
      color: '#F87171',
      bg: 'rgba(248, 113, 113, 0.12)',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {macros.map((macro) => (
          <View key={macro.label} style={[styles.card, { backgroundColor: macro.bg }]}>
            <Text style={[styles.value, { color: macro.color }]}>{macro.value}</Text>
            <Text style={styles.label}>{macro.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
