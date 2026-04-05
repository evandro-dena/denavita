import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Clock, Users, BarChart2, Heart, Check } from 'lucide-react-native';
import { mockRecipes } from '@/mocks/recipesData';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useAppStore } from '@/store';

const { width: SW, height: SH } = Dimensions.get('window');
const HERO_H = SH * 0.4;

// ─── Macro chip ───────────────────────────────────────────────────────────────
function MacroChip({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  return (
    <View style={macroStyles.chip}>
      <Text style={[macroStyles.value, { color }]}>
        {value}
        <Text style={macroStyles.unit}>{unit}</Text>
      </Text>
      <Text style={macroStyles.label}>{label}</Text>
    </View>
  );
}

const macroStyles = StyleSheet.create({
  chip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#181818',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 3,
  },
  value: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
  },
  unit: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
  },
});

// ─── Badge ────────────────────────────────────────────────────────────────────
function InfoBadge({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
  label: string;
}) {
  return (
    <View style={badgeStyles.badge}>
      <Icon size={13} color={Colors.textSecondary} strokeWidth={2} />
      <Text style={badgeStyles.text}>{label}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1E1E1E',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

// ─── Ingredient row ───────────────────────────────────────────────────────────
function IngredientRow({
  text,
  checked,
  onToggle,
}: {
  text: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      style={ingStyles.row}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[ingStyles.checkbox, checked && ingStyles.checkboxOn]}>
        {checked && <Check size={11} color="#000" strokeWidth={3} />}
      </View>
      <Text style={[ingStyles.text, checked && ingStyles.textDone]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const ingStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxOn: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  text: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  textDone: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
});

// ─── Step row ─────────────────────────────────────────────────────────────────
function StepRow({ index, text }: { index: number; text: string }) {
  return (
    <View style={stepStyles.row}>
      <View style={stepStyles.number}>
        <Text style={stepStyles.numText}>{index + 1}</Text>
      </View>
      <Text style={stepStyles.text}>{text}</Text>
    </View>
  );
}

const stepStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  number: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accentFaded,
    borderWidth: 1,
    borderColor: 'rgba(200,255,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  numText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 13,
    color: Colors.accent,
  },
  text: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.text,
    lineHeight: 21,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = mockRecipes.find((r) => r.id === id);

  const [checked, setChecked] = useState<Set<string>>(new Set());
  const likedIds = useAppStore((s) => s.likedRecipeIds);
  const toggleLike = useAppStore((s) => s.toggleLikedRecipe);
  const saved = id ? likedIds.has(id) : false;

  function toggleIngredient(ingId: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(ingId) ? next.delete(ingId) : next.add(ingId);
      return next;
    });
  }

  if (!recipe) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Receita não encontrada</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.notFoundBack}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const checkedCount = checked.size;
  const totalIng = recipe.ingredients.length;

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* ── HERO ──────────────────────────────────────── */}
        <ImageBackground
          source={recipe.coverImage ?? { uri: '' }}
          style={[styles.hero, { backgroundColor: recipe.color }]}
          imageStyle={{ resizeMode: 'cover' }}
        >
          {!recipe.coverImage && (
            <Text style={styles.heroEmoji}>{recipe.emoji}</Text>
          )}

          {/* Gradient overlay */}
          <LinearGradient
            colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.5)', Colors.background]}
            locations={[0.2, 0.65, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          {/* Back button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={20} color="#fff" strokeWidth={2} />
          </TouchableOpacity>

          {/* Category pill on hero */}
          <View style={styles.heroCategoryPill}>
            <Text style={styles.heroCategoryText}>{recipe.category}</Text>
          </View>
        </ImageBackground>

        {/* ── CONTENT ───────────────────────────────────── */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.recipeName}>{recipe.name}</Text>

          {/* Info badges */}
          <View style={styles.badgesRow}>
            <InfoBadge icon={Clock} label={recipe.time} />
            <InfoBadge icon={Users} label={`${recipe.servings} porç.`} />
            <InfoBadge icon={BarChart2} label={recipe.difficulty} />
          </View>

          {/* Macro card */}
          <View style={styles.macroCard}>
            <MacroChip label="Calorias" value={recipe.calories} unit=" kcal" color={Colors.accent} />
            <MacroChip label="Proteína" value={recipe.protein} unit="g" color="#52A8FF" />
            <MacroChip label="Carbo" value={recipe.carbs} unit="g" color="#FFB74D" />
            <MacroChip label="Lipídeo" value={recipe.fat} unit="g" color="#FF7E7E" />
          </View>

          {/* ── INGREDIENTS ─────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ingredientes</Text>
              <Text style={styles.sectionCount}>
                {checkedCount}/{totalIng}
              </Text>
            </View>

            {/* Progress bar */}
            <View style={styles.ingProgressTrack}>
              <View
                style={[
                  styles.ingProgressFill,
                  { width: `${(checkedCount / totalIng) * 100}%` },
                ]}
              />
            </View>

            <View style={styles.ingredientList}>
              {recipe.ingredients.map((ing) => (
                <IngredientRow
                  key={ing.id}
                  text={ing.text}
                  checked={checked.has(ing.id)}
                  onToggle={() => toggleIngredient(ing.id)}
                />
              ))}
            </View>
          </View>

          {/* ── PREPARATION ─────────────────────────────── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Modo de Preparo</Text>
            <View style={styles.stepList}>
              {recipe.steps.map((step, i) => (
                <StepRow key={i} index={i} text={step} />
              ))}
            </View>
          </View>

          {/* Bottom padding for FAB */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* ── FLOATING SAVE BUTTON ──────────────────────── */}
      <TouchableOpacity
        style={[styles.fab, saved && styles.fabSaved]}
        onPress={() => id && toggleLike(id)}
        activeOpacity={0.85}
      >
        <Heart
          size={20}
          color={saved ? '#fff' : '#000'}
          fill={saved ? '#FF6B6B' : 'transparent'}
          strokeWidth={2}
        />
        <Text style={[styles.fabText, saved && styles.fabTextSaved]}>
          {saved ? 'Salvo!' : 'Salvar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Not found
  notFound: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  notFoundText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: Colors.textSecondary,
  },
  notFoundBack: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.accent,
  },

  // Hero
  hero: {
    height: HERO_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 96,
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 40,
    left: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCategoryPill: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 40,
    right: Spacing.md,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  heroCategoryText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#000',
  },

  // Content
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.lg,
  },
  recipeName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    color: Colors.text,
    lineHeight: 30,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: -Spacing.sm,
  },
  macroCard: {
    flexDirection: 'row',
    gap: 8,
  },

  // Sections
  section: {
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
    color: Colors.text,
  },
  sectionCount: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.accent,
  },
  ingProgressTrack: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  ingProgressFill: {
    height: 4,
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  ingredientList: {
    gap: 2,
  },
  stepList: {
    gap: Spacing.md,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 36 : 24,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 22,
    paddingVertical: 14,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabSaved: {
    backgroundColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
  },
  fabText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    color: '#000',
  },
  fabTextSaved: {
    color: '#fff',
  },
});
