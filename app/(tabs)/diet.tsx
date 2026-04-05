import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';
import DailyMacroSummary from '@/components/diet/DailyMacroSummary';
import MealCard from '@/components/diet/MealCard';
import { mockDietPlan } from '@/constants/mockData';

export default function DietScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Plano Alimentar</Text>
          <Text style={styles.subtitle}>Domingo, 29 de Março de 2026</Text>
        </View>

        {/* Daily Macro Summary */}
        <DailyMacroSummary plan={mockDietPlan} />

        {/* Meals */}
        <Text style={styles.mealsTitle}>Refeições do Dia</Text>
        {mockDietPlan.meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}

        <View style={styles.note}>
          <Text style={styles.noteText}>
            💡 Toque em cada refeição para ver os alimentos e opções de substituição.
          </Text>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.heading2,
    color: Colors.text,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 3,
  },
  mealsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  note: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  noteText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  bottomPad: {
    height: Spacing.lg,
  },
});
