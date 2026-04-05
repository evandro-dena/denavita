import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Heart } from 'lucide-react-native';
import { mockRecipes } from '@/mocks/recipesData';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import type { Recipe, RecipeCategory } from '@/types';

const { width: SW } = Dimensions.get('window');
const CARD_GAP = 12;
const H_PAD = Spacing.md * 2;
const CARD_W = (SW - H_PAD - CARD_GAP) / 2;

const CATEGORIES: RecipeCategory[] = [
  'Todas', 'Café', 'Lanches', 'Almoço', 'Salgadas', 'Sobremesas',
];

// ─── Filter pill ─────────────────────────────────────────────────────────────
function FilterPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[pillStyles.pill, active && pillStyles.pillActive]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[pillStyles.text, active && pillStyles.textActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const pillStyles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.pill,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  text: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  textActive: {
    color: '#000',
    fontFamily: 'Inter_500Medium',
  },
});

// ─── Recipe card ─────────────────────────────────────────────────────────────
function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [liked, setLiked] = useState(false);

  return (
    <TouchableOpacity
      style={cardStyles.card}
      onPress={() => router.push(`/(tabs)/recipes/${recipe.id}`)}
      activeOpacity={0.85}
    >
      {/* Image / emoji placeholder */}
      <View style={[cardStyles.imageBox, { backgroundColor: recipe.color }]}>
        <Text style={cardStyles.emoji}>{recipe.emoji}</Text>

        {/* Heart button */}
        <TouchableOpacity
          style={cardStyles.heartBtn}
          onPress={() => setLiked(l => !l)}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Heart
            size={16}
            color={liked ? '#FF6B6B' : 'rgba(255,255,255,0.85)'}
            fill={liked ? '#FF6B6B' : 'transparent'}
            strokeWidth={2}
          />
        </TouchableOpacity>

        {/* Category pill */}
        <View style={cardStyles.categoryPill}>
          <Text style={cardStyles.categoryText}>{recipe.category}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={cardStyles.info}>
        <Text style={cardStyles.name} numberOfLines={2}>
          {recipe.name}
        </Text>
        <View style={cardStyles.metaRow}>
          <Text style={cardStyles.kcal}>{recipe.calories} kcal</Text>
          <Text style={cardStyles.time}>{recipe.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    width: CARD_W,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageBox: {
    width: '100%',
    height: CARD_W * 0.72,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emoji: {
    fontSize: 48,
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryPill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
  },
  info: {
    padding: 10,
    gap: 4,
  },
  name: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kcal: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.accent,
  },
  time: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
  },
});

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function RecipesScreen() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<RecipeCategory>('Todas');

  const filtered = useMemo(() => {
    return mockRecipes.filter((r) => {
      const matchCat =
        activeCategory === 'Todas' || r.category === activeCategory;
      const matchQ = r.name.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQ;
    });
  }, [query, activeCategory]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── HEADER ─────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.title}>Receitas</Text>
        <Text style={styles.subtitle}>
          {filtered.length} receita{filtered.length !== 1 ? 's' : ''} saudável{filtered.length !== 1 ? 'is' : ''}
        </Text>
      </View>

      {/* ── SEARCH ─────────────────────────────────────── */}
      <View style={styles.searchWrapper}>
        <Search size={16} color={Colors.textMuted} strokeWidth={2} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar receitas..."
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      {/* ── FILTER PILLS ───────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsRow}
        style={styles.pillsScroll}
      >
        {CATEGORIES.map((cat) => (
          <FilterPill
            key={cat}
            label={cat}
            active={activeCategory === cat}
            onPress={() => setActiveCategory(cat)}
          />
        ))}
      </ScrollView>

      {/* ── GRID ───────────────────────────────────────── */}
      <FlatList
        data={filtered}
        keyExtractor={(r) => r.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>Nenhuma receita encontrada</Text>
            <Text style={styles.emptySub}>Tente outro filtro ou busca</Text>
          </View>
        }
        renderItem={({ item }) => <RecipeCard recipe={item} />}
      />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: 4,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    backgroundColor: '#1A1A1A',
    borderRadius: BorderRadius.input,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 46,
    paddingHorizontal: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.text,
    height: '100%',
  },
  pillsScroll: {
    marginTop: Spacing.md,
    flexGrow: 0,
    flexShrink: 0,
  },
  pillsRow: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    gap: 8,
    alignItems: 'center',
  },
  grid: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: CARD_GAP,
  },
  row: {
    gap: CARD_GAP,
    justifyContent: 'flex-start',
  },
  emptyBox: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyEmoji: { fontSize: 48 },
  emptyText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptySub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
  },
});
