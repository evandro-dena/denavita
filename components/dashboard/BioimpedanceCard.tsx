import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BioimpedanceRecord } from '@/types';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

interface BioimpedanceCardProps {
  record: BioimpedanceRecord;
}

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface MetricItem {
  id: string;
  label: string;
  value: string;
  icon: IoniconsName;
}

export default function BioimpedanceCard({ record }: BioimpedanceCardProps) {
  const metrics: MetricItem[] = [
    {
      id: '1',
      label: 'Gordura Corporal',
      value: `${record.bodyFatPercentage}%`,
      icon: 'flame-outline',
    },
    {
      id: '2',
      label: 'Massa Magra',
      value: `${record.leanMass} kg`,
      icon: 'fitness-outline',
    },
    {
      id: '3',
      label: 'Massa Gorda',
      value: `${record.fatMass} kg`,
      icon: 'scale-outline',
    },
    {
      id: '4',
      label: 'Água Corporal',
      value: `${record.bodyWater}%`,
      icon: 'water-outline',
    },
    {
      id: '5',
      label: 'Taxa Metabólica',
      value: `${record.metabolicRate.toLocaleString('pt-BR')} kcal`,
      icon: 'flash-outline',
    },
    {
      id: '6',
      label: 'IMC',
      value: `${record.bmi}`,
      icon: 'heart-outline',
    },
  ];

  const renderItem = ({ item }: { item: MetricItem }) => (
    <LinearGradient
      colors={[Colors.surfaceGradientStart, Colors.surfaceGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.metricCard}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={20} color={Colors.primaryLight} />
      </View>
      <Text style={styles.metricValue}>{item.value}</Text>
      <Text style={styles.metricLabel}>{item.label}</Text>
    </LinearGradient>
  );

  return (
    <FlatList
      data={metrics}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      scrollEnabled={false}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  row: {
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  metricCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Spacing.md,
    alignItems: 'flex-start',
  },
  iconContainer: {
    backgroundColor: Colors.primaryFaded,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  metricValue: {
    ...Typography.heading3,
    color: Colors.text,
    marginBottom: 2,
  },
  metricLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    lineHeight: 17,
  },
});
