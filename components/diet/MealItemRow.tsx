import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MealItem } from '@/types';
import { Colors, Typography, Spacing } from '@/constants/theme';

interface MealItemRowProps {
  item: MealItem;
}

export default function MealItemRow({ item }: MealItemRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.quantity}>{item.quantity}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.calories}>{item.calories} kcal</Text>
        <View style={styles.macros}>
          <Text style={styles.macro}>
            <Text style={[styles.macroLabel, { color: '#60A5FA' }]}>P </Text>
            {item.protein}g
          </Text>
          <Text style={styles.macro}>
            <Text style={[styles.macroLabel, { color: '#FBBF24' }]}>C </Text>
            {item.carbs}g
          </Text>
          <Text style={styles.macro}>
            <Text style={[styles.macroLabel, { color: '#F87171' }]}>G </Text>
            {item.fat}g
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  left: {
    flex: 1,
    marginRight: Spacing.md,
  },
  name: {
    ...Typography.body,
    color: Colors.text,
    marginBottom: 2,
  },
  quantity: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  right: {
    alignItems: 'flex-end',
  },
  calories: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 3,
  },
  macros: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  macro: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  macroLabel: {
    fontWeight: '700',
  },
});
