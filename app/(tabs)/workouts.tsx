import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';

export default function WorkoutsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="barbell-outline" size={64} color={Colors.textMuted} />
          </View>
          <View style={styles.accentLine} />
          <Text style={styles.title}>Em breve</Text>
          <Text style={styles.subtitle}>
            Módulo de treinos chegando na próxima atualização.
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>FASE 2</Text>
          </View>
        </View>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 280,
  },
  iconContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: Spacing.xl,
  },
  accentLine: {
    width: 40,
    height: 3,
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.heading1,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  badge: {
    backgroundColor: Colors.primaryFaded,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryLight,
    letterSpacing: 2,
  },
});
