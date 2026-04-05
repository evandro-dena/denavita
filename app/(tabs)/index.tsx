import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Bell, ChevronRight, X } from 'lucide-react-native';
import GaugeChart from '@/components/dashboard/GaugeChart';
import FadeUpView from '@/components/ui/FadeUpView';
import { mockUser } from '@/mocks/userData';
import { mockMealPlan } from '@/mocks/mealPlanData';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
// TODO: conectar API — importar mealPlanService e authService na V2

// ─── Helpers ────────────────────────────────────────────────────────────────

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function buildWeekDays() {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dow);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return {
      label: DAY_NAMES[d.getDay()],
      date: d.getDate(),
      isToday: d.toDateString() === today.toDateString(),
    };
  });
}

function formatKcal(kcal: number) {
  return kcal >= 1000 ? `${(kcal / 1000).toFixed(1)}K` : `${kcal}`;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function WeekCalendar() {
  const days = buildWeekDays();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.calendarRow}
    >
      {days.map((d, i) => (
        <TouchableOpacity key={i} style={styles.dayItem} activeOpacity={0.7}>
          <Text style={[styles.dayName, d.isToday && styles.dayNameActive]}>
            {d.label}
          </Text>
          {d.isToday ? (
            <LinearGradient
              colors={[Colors.accent, '#A3D900']}
              style={styles.dayCircleActive}
            >
              <Text style={styles.dayNumActive}>{d.date}</Text>
            </LinearGradient>
          ) : (
            <View style={styles.dayCircle}>
              <Text style={styles.dayNum}>{d.date}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

interface StatPillProps {
  label: string;
  value: string;
}
function StatPill({ label, value }: StatPillProps) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

interface MacroBadgeProps {
  label: string;
}
function MacroBadge({ label }: MacroBadgeProps) {
  return (
    <View style={styles.macroBadge}>
      <Text style={styles.macroBadgeText}>{label}</Text>
    </View>
  );
}

// ─── Update Weight Modal ─────────────────────────────────────────────────────

interface UpdateWeightModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (weight: number) => void;
}

function UpdateWeightModal({ visible, onClose, onConfirm }: UpdateWeightModalProps) {
  const [value, setValue] = useState('');

  function handleConfirm() {
    const w = parseFloat(value.replace(',', '.'));
    if (isNaN(w) || w < 30 || w > 300) {
      Alert.alert('Peso inválido', 'Digite um valor entre 30 e 300 kg.');
      return;
    }
    onConfirm(w);
    setValue('');
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalBackdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Atualizar Peso</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSub}>Digite seu peso atual em quilogramas</Text>

          <View style={styles.modalInputWrapper}>
            <TextInput
              style={styles.modalInput}
              value={value}
              onChangeText={setValue}
              placeholder="Ex: 76.5"
              placeholderTextColor={Colors.textMuted}
              keyboardType="decimal-pad"
              autoFocus
            />
            <Text style={styles.modalUnit}>kg</Text>
          </View>

          <TouchableOpacity onPress={handleConfirm} activeOpacity={0.85}>
            <LinearGradient
              colors={['#C8FF00', '#A3D900']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.modalConfirmBtn}
            >
              <Text style={styles.modalConfirmText}>Confirmar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [currentWeight, setCurrentWeight] = useState(mockUser.currentWeight);
  const [modalVisible, setModalVisible] = useState(false);

  const weightLost = parseFloat((mockUser.startWeight - currentWeight).toFixed(1));
  const { totalCalories, totalProtein, totalCarbs, totalFat } = mockMealPlan;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── HEADER ─────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Avatar */}
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>
                {mockUser.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.greeting}>
                Olá, {mockUser.name} 👋
              </Text>
              <Text style={styles.greetingSub}>Bom dia! Vamos à dieta?</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellBtn}>
            <Bell size={20} color={Colors.textSecondary} strokeWidth={1.8} />
          </TouchableOpacity>
        </View>

        {/* ── BLOCO 1 — CALENDÁRIO SEMANAL ───────────────── */}
        <FadeUpView delay={60}>
          <View style={styles.calendarCard}>
            <WeekCalendar />
          </View>
        </FadeUpView>

        {/* ── BLOCO 2 — META DE PESO ─────────────────────── */}
        <FadeUpView delay={160}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Progresso do Peso</Text>
            <View style={styles.progressPct}>
              <Text style={styles.progressPctText}>
                {Math.round(((mockUser.startWeight - currentWeight) /
                  (mockUser.startWeight - mockUser.goalWeight)) * 100)}%
              </Text>
            </View>
          </View>

          {/* Gauge */}
          <GaugeChart
            currentWeight={currentWeight}
            startWeight={mockUser.startWeight}
            goalWeight={mockUser.goalWeight}
          />

          {/* 3 mini-stats */}
          <View style={styles.statsRow}>
            <StatPill label="Perda" value={`${weightLost} kg`} />
            <View style={styles.statDivider} />
            <StatPill label="Queimado" value={`${formatKcal(mockUser.caloriesBurned)} kcal`} />
            <View style={styles.statDivider} />
            <StatPill label="Meta" value={`${mockUser.goalWeight} kg`} />
          </View>

          {/* Botão Atualizar Peso */}
          <TouchableOpacity
            style={styles.updateWeightBtn}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.75}
          >
            <Text style={styles.updateWeightText}>Atualizar Peso</Text>
          </TouchableOpacity>
        </View>
        </FadeUpView>

        {/* ── BLOCO 3 — NUTRIÇÃO ─────────────────────────── */}
        {/* TODO: conectar API — mealPlanService.getMealPlan(userId) */}
        <FadeUpView delay={260}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/meal-plan')}
          activeOpacity={0.85}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Plano Alimentar</Text>
            <ChevronRight size={18} color={Colors.accent} strokeWidth={2} />
          </View>

          {/* Macro badges */}
          <View style={styles.macroRow}>
            <MacroBadge label={`${totalProtein}g Proteína`} />
            <MacroBadge label={`${totalCarbs}g Carbo`} />
            <MacroBadge label={`${totalFat}g Lipídeo`} />
          </View>

          {/* Total kcal */}
          <Text style={styles.kcalTotal}>
            {totalCalories.toLocaleString('pt-BR')} kcal total
          </Text>

          {/* Tap hint */}
          <Text style={styles.tapHint}>Toque para ver o plano completo →</Text>
        </TouchableOpacity>
        </FadeUpView>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>

      {/* Update Weight Modal */}
      <UpdateWeightModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={(w) => setCurrentWeight(w)}
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
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accentFaded,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: Colors.accent,
  },
  greeting: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  greetingSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Calendar card
  calendarCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
  },
  calendarRow: {
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  dayItem: {
    alignItems: 'center',
    gap: 6,
    minWidth: 40,
  },
  dayName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  dayNameActive: {
    color: Colors.accent,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNum: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  dayCircleActive: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumActive: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 14,
    color: '#000000',
  },

  // Generic card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    color: Colors.text,
  },

  // Progress %
  progressPct: {
    backgroundColor: Colors.accentFaded,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  progressPctText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.accent,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#181818',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statPill: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },

  // Update weight button
  updateWeightBtn: {
    borderWidth: 1.5,
    borderColor: Colors.accent,
    borderRadius: BorderRadius.input,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateWeightText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.accent,
  },

  // Macro badges
  macroRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  macroBadge: {
    backgroundColor: Colors.accentFaded,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(200,255,0,0.25)',
  },
  macroBadgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.accent,
  },
  kcalTotal: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 22,
    color: Colors.text,
  },
  tapHint: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: -Spacing.sm,
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: Colors.text,
  },
  modalSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: -Spacing.sm,
  },
  modalInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222222',
    borderRadius: BorderRadius.input,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 56,
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  modalInput: {
    flex: 1,
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: Colors.text,
  },
  modalUnit: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: Colors.textSecondary,
  },
  modalConfirmBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#000000',
  },
});
