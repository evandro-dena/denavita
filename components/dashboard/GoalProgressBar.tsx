import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from '@/types';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import Card from '@/components/ui/Card';

interface GoalProgressBarProps {
  user: User;
}

export default function GoalProgressBar({ user }: GoalProgressBarProps) {
  const totalToLose = user.startWeight - user.goalWeight;
  const alreadyLost = user.startWeight - user.currentWeight;
  const remaining = user.currentWeight - user.goalWeight;
  const progress = Math.min(alreadyLost / totalToLose, 1);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>PROGRESSO DA META</Text>
        <Text style={styles.percentage}>{Math.round(progress * 100)}%</Text>
      </View>

      <View style={styles.barContainer}>
        <View style={styles.barTrack}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.barFill, { width: `${progress * 100}%` }]}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLabel}>Início: {user.startWeight} kg</Text>
        <View style={styles.remainingBadge}>
          <Text style={styles.remainingText}>Faltam {remaining.toFixed(1)} kg</Text>
        </View>
        <Text style={styles.footerLabel}>Meta: {user.goalWeight} kg</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 1.2,
  },
  percentage: {
    ...Typography.body,
    color: Colors.primaryLight,
    fontWeight: '600',
  },
  barContainer: {
    marginBottom: Spacing.md,
  },
  barTrack: {
    height: 8,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.full,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  remainingBadge: {
    backgroundColor: Colors.primaryFaded,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  remainingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryLight,
  },
});
