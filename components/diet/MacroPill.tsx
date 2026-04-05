import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BorderRadius, Spacing } from '@/constants/theme';

interface MacroPillProps {
  label: string;
  value: string;
  color: string;
}

export default function MacroPill({ label, value, color }: MacroPillProps) {
  return (
    <View style={[styles.pill, { backgroundColor: `${color}18` }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
  },
});
