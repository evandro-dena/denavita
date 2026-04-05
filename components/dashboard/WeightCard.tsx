import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@/types';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import Card from '@/components/ui/Card';

interface WeightCardProps {
  user: User;
}

export default function WeightCard({ user }: WeightCardProps) {
  const isLosing = user.currentWeight < user.startWeight;

  return (
    <Card style={styles.card}>
      <Text style={styles.label}>PESO ATUAL</Text>
      <View style={styles.row}>
        <Text style={styles.weight}>{user.currentWeight.toFixed(1)}</Text>
        <Text style={styles.unit}>kg</Text>
        <View style={styles.trendBadge}>
          <Ionicons
            name={isLosing ? 'arrow-down' : 'arrow-up'}
            size={16}
            color={isLosing ? Colors.success : Colors.danger}
          />
          <Text style={[styles.trendText, { color: isLosing ? Colors.success : Colors.danger }]}>
            {Math.abs(user.startWeight - user.currentWeight).toFixed(1)} kg
          </Text>
        </View>
      </View>
      <Text style={styles.lastRecord}>Último registro: {user.lastWeightDate}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  weight: {
    fontSize: 52,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 60,
  },
  unit: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryFaded,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginBottom: 8,
    gap: 2,
  },
  trendText: {
    fontSize: 13,
    fontWeight: '600',
  },
  lastRecord: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
});
