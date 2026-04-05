import { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { mockMealPlan } from '@/mocks/mealPlanData';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import type { Meal } from '@/types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function todayFormatted() {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Macro Bar Row ───────────────────────────────────────────────────────────

interface MacroBarProps {
  label: string;
  value: string;
  percent: number; // 0-1
  color: string;
}

function MacroBar({ label, value, percent, color }: MacroBarProps) {
  return (
    <View style={macroStyles.row}>
      <View style={macroStyles.labelRow}>
        <Text style={macroStyles.label}>{label}</Text>
        <Text style={[macroStyles.value, { color }]}>{value}</Text>
      </View>
      <View style={macroStyles.track}>
        <View
          style={[
            macroStyles.fill,
            { width: `${Math.round(percent * 100)}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

const macroStyles = StyleSheet.create({
  row: {
    gap: 5,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  value: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  track: {
    height: 6,
    backgroundColor: '#2A2A2A',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: 3,
  },
});

// ─── Meal Accordion ──────────────────────────────────────────────────────────

function MealAccordion({ meal }: { meal: Meal }) {
  const [open, setOpen] = useState(false);
  const measuredH = useRef(0);
  const animH = useSharedValue(0);
  const arrowDeg = useSharedValue(0);

  const bodyAnimStyle = useAnimatedStyle(() => ({
    height: animH.value,
    overflow: 'hidden',
  }));

  const arrowAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${arrowDeg.value}deg` }],
  }));

  function toggle() {
    const next = !open;
    setOpen(next);
    animH.value = withTiming(next ? measuredH.current : 0, {
      duration: 300,
      easing: Easing.inOut(Easing.cubic),
    });
    arrowDeg.value = withTiming(next ? 180 : 0, { duration: 300 });
  }

  function onBodyLayout(e: LayoutChangeEvent) {
    const h = e.nativeEvent.layout.height;
    if (h > 0 && measuredH.current === 0) {
      measuredH.current = h;
    }
  }

  const totalCal = meal.items.reduce((s, i) => s + i.calories, 0);
  const totalP = meal.items.reduce((s, i) => s + i.protein, 0);
  const totalC = meal.items.reduce((s, i) => s + i.carbs, 0);
  const totalF = meal.items.reduce((s, i) => s + i.fat, 0);

  return (
    <View style={accordionStyles.card}>
      {/* Header — always visible */}
      <TouchableOpacity
        onPress={toggle}
        style={accordionStyles.header}
        activeOpacity={0.7}
      >
        {/* Left: emoji circle + name + time */}
        <View style={accordionStyles.headerLeft}>
          <View style={accordionStyles.emojiCircle}>
            <Text style={accordionStyles.emojiText}>{meal.emoji}</Text>
          </View>
          <View style={accordionStyles.headerInfo}>
            <Text style={accordionStyles.mealName}>{meal.name}</Text>
            <Text style={accordionStyles.mealMeta}>
              {meal.time} · {totalCal} kcal
            </Text>
          </View>
        </View>

        {/* Right: chevron */}
        <Animated.View style={arrowAnimStyle}>
          <ChevronDown size={18} color={Colors.textSecondary} strokeWidth={2} />
        </Animated.View>
      </TouchableOpacity>

      {/* Expandable body */}
      <Animated.View style={bodyAnimStyle}>
        {/* This inner View is always rendered so onLayout fires immediately */}
        <View onLayout={onBodyLayout} style={accordionStyles.body}>
          {/* Separator */}
          <View style={accordionStyles.separator} />

          {/* Food items */}
          {meal.items.map((item, idx) => (
            <View key={item.id} style={accordionStyles.foodItem}>
              <View style={accordionStyles.foodDot} />
              <Text style={accordionStyles.foodName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={accordionStyles.foodQty}>{item.quantity}</Text>
            </View>
          ))}

          {/* Macro totals */}
          <View style={accordionStyles.macroSummary}>
            <MacroChip label="Prot" value={`${totalP}g`} color={Colors.accent} />
            <MacroChip label="Carbo" value={`${totalC}g`} color="#52A8FF" />
            <MacroChip label="Gord" value={`${totalF}g`} color="#FFB74D" />
            <MacroChip label="kcal" value={`${totalCal}`} color={Colors.textSecondary} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

function MacroChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={chipStyles.chip}>
      <Text style={[chipStyles.value, { color }]}>{value}</Text>
      <Text style={chipStyles.label}>{label}</Text>
    </View>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: '#181818',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  value: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
});

const accordionStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  emojiCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#202020',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 20,
  },
  headerInfo: {
    flex: 1,
  },
  mealName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: Colors.text,
  },
  mealMeta: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  body: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: 8,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 4,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  foodDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
    marginTop: 6,
    flexShrink: 0,
  },
  foodName: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  foodQty: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
    flexShrink: 0,
    maxWidth: 120,
  },
  macroSummary: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
});

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function MealPlanScreen() {
  const { totalCalories, totalProtein, totalCarbs, totalFat, meals } = mockMealPlan;

  // Bars are proportional to largest macro (protein = 158g)
  const maxMacro = totalProtein;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── HEADER ───────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={20} color={Colors.text} strokeWidth={2} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Plano Alimentar</Text>
          <Text style={styles.headerDate}>{capitalize(todayFormatted())}</Text>
        </View>

        {/* Spacer to center title */}
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── MACRO SUMMARY CARD ───────────────────────────── */}
        <View style={styles.macroCard}>
          {/* Total kcal badge */}
          <View style={styles.kcalRow}>
            <Text style={styles.kcalLabel}>Total diário</Text>
            <View style={styles.kcalBadge}>
              <Text style={styles.kcalValue}>
                {totalCalories.toLocaleString('pt-BR')} kcal
              </Text>
            </View>
          </View>

          {/* Macro bars */}
          <View style={styles.macroBarList}>
            <MacroBar
              label="Proteína"
              value={`${totalProtein}g`}
              percent={totalProtein / maxMacro}
              color={Colors.accent}
            />
            <MacroBar
              label="Carboidratos"
              value={`${totalCarbs}g`}
              percent={totalCarbs / maxMacro}
              color="#52A8FF"
            />
            <MacroBar
              label="Lipídeos"
              value={`${totalFat}g`}
              percent={totalFat / maxMacro}
              color="#FFB74D"
            />
          </View>
        </View>

        {/* ── REFEIÇÕES ────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Refeições do dia</Text>

        <View style={styles.mealList}>
          {meals.map((meal) => (
            <MealAccordion key={meal.id} meal={meal} />
          ))}
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Platform.OS === 'android' ? Spacing.md : 0,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  headerDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },

  // Macro card
  macroCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  kcalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kcalLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: Colors.text,
  },
  kcalBadge: {
    backgroundColor: Colors.accentFaded,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(200,255,0,0.25)',
  },
  kcalValue: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.accent,
  },
  macroBarList: {
    gap: Spacing.sm,
  },

  // Section title
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
    marginBottom: -4,
  },

  // Meal list
  mealList: {
    gap: Spacing.sm,
  },
});
