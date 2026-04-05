import { memo, useState } from 'react';
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
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Bell, ChevronRight, X, Sparkles, Send } from 'lucide-react-native';
import GaugeChart from '@/components/dashboard/GaugeChart';
// import WeightLineChart from '@/components/dashboard/WeightLineChart'; // teste salvo
import FadeUpView from '@/components/ui/FadeUpView';
import NeuralMesh from '@/components/ui/NeuralMesh';
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

const WeekCalendar = memo(function WeekCalendar() {
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
});

interface StatPillProps {
  label: string;
  value: string;
}
const StatPill = memo(function StatPill({ label, value }: StatPillProps) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
});


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

// ─── AI Chat Block ───────────────────────────────────────────────────────────

function AIChatBlock({ userName }: { userName: string }) {
  const [inputText, setInputText] = useState('');
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={aiStyles.card}
        onPress={() => setChatOpen(true)}
        activeOpacity={0.9}
      >
        {/* Núcleo neural — compacto, centralizado */}
        <View style={aiStyles.meshArea}>
          <NeuralMesh />
        </View>

        {/* Texto ABAIXO do núcleo — sem sobreposição */}
        <View style={aiStyles.textArea}>
          <View style={aiStyles.badgeRow}>
            <Sparkles size={12} color={Colors.accent} strokeWidth={2} />
            <Text style={aiStyles.badgeText}>IA Nutricional</Text>
          </View>
          <Text style={aiStyles.greeting}>Olá, {userName}!</Text>
          <Text style={aiStyles.sub}>Como posso te ajudar hoje?</Text>
        </View>

        {/* Input simulado na base */}
        <View style={aiStyles.inputRow} pointerEvents="none">
          <Text style={aiStyles.inputPlaceholder}>Faça uma pergunta...</Text>
          <View style={aiStyles.sendBtn}>
            <Send size={14} color="#000" strokeWidth={2.5} />
          </View>
        </View>
      </TouchableOpacity>

      {/* Modal de chat (V1 — simulado) */}
      <Modal
        visible={chatOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setChatOpen(false)}
      >
        <View style={chatStyles.backdrop}>
          <View style={chatStyles.sheet}>
            {/* Header */}
            <View style={chatStyles.header}>
              <View style={chatStyles.headerLeft}>
                <Sparkles size={18} color={Colors.accent} strokeWidth={2} />
                <Text style={chatStyles.headerTitle}>Assistente Nutricional</Text>
              </View>
              <TouchableOpacity onPress={() => setChatOpen(false)}>
                <X size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Núcleo + texto no modal — só monta quando modal abre */}
            <View style={chatStyles.meshWrapper}>
              {chatOpen && <NeuralMesh />}
            </View>
            <Text style={chatStyles.meshGreeting}>
              Olá, {userName}!{'\n'}Como posso te ajudar hoje?
            </Text>

            {/* Sugestões rápidas */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={chatStyles.suggestionsRow}
            >
              {[
                'O que posso comer antes do treino?',
                'Quantas proteínas preciso por dia?',
                'O que é déficit calórico?',
                'Posso comer fruta à noite?',
              ].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={chatStyles.suggestion}
                  onPress={() => setInputText(s)}
                >
                  <Text style={chatStyles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Aviso V1 */}
            <View style={chatStyles.v1Banner}>
              <Text style={chatStyles.v1Text}>
                🚧 Em breve — IA treinada em nutrição estará disponível na V2
              </Text>
            </View>

            {/* Input */}
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <View style={chatStyles.inputArea}>
                <TextInput
                  style={chatStyles.input}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Faça uma pergunta sobre nutrição..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                />
                <TouchableOpacity
                  style={[
                    chatStyles.sendBtn,
                    !inputText.trim() && chatStyles.sendBtnDisabled,
                  ]}
                  disabled={!inputText.trim()}
                >
                  <Send size={16} color="#000" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const aiStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    alignItems: 'center',
  },
  // Área do núcleo — compacta e centralizada
  meshArea: {
    paddingTop: Spacing.md,
    paddingBottom: 4,
    alignItems: 'center',
  },
  // Texto abaixo — sem sobreposição
  textArea: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.accentFaded,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(200,255,0,0.2)',
  },
  badgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.accent,
  },
  greeting: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
    color: Colors.text,
    textAlign: 'center',
  },
  sub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 46,
    width: '100%',
    paddingHorizontal: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: '#161616',
  },
  inputPlaceholder: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
  },
  sendBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const chatStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: Colors.border,
    paddingBottom: Platform.OS === 'ios' ? 36 : 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  meshWrapper: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
  },
  meshGreeting: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  suggestionsRow: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: 8,
  },
  suggestion: {
    backgroundColor: '#222222',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suggestionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  v1Banner: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.accentFaded,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(200,255,0,0.2)',
  },
  v1Text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.accent,
    textAlign: 'center',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.text,
    backgroundColor: '#222222',
    borderRadius: BorderRadius.input,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Colors.border,
  },
});

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
            style={mealCardStyles.wrapper}
            onPress={() => router.push('/meal-plan')}
            activeOpacity={0.9}
          >
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80' }}
              style={mealCardStyles.image}
              imageStyle={mealCardStyles.imageStyle}
            >
              {/* Gradient overlay escuro */}
              <LinearGradient
                colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.88)']}
                style={mealCardStyles.overlay}
              >
                {/* Badge topo */}
                <View style={mealCardStyles.topRow}>
                  <View style={mealCardStyles.badge}>
                    <Text style={mealCardStyles.badgeText}>Nutrição</Text>
                  </View>
                  <ChevronRight size={18} color="rgba(255,255,255,0.7)" strokeWidth={2} />
                </View>

                {/* Macros em pílulas compactas */}
                <View style={mealCardStyles.macroRow}>
                  {[
                    { label: 'P', value: `${totalProtein}g` },
                    { label: 'C', value: `${totalCarbs}g` },
                    { label: 'G', value: `${totalFat}g` },
                  ].map((m) => (
                    <View key={m.label} style={mealCardStyles.macroPill}>
                      <Text style={mealCardStyles.macroLabel}>{m.label}</Text>
                      <Text style={mealCardStyles.macroValue}>{m.value}</Text>
                    </View>
                  ))}
                </View>

                {/* Título e kcal */}
                <Text style={mealCardStyles.title}>Plano Alimentar</Text>
                <Text style={mealCardStyles.kcal}>
                  {totalCalories.toLocaleString('pt-BR')} kcal hoje
                </Text>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        </FadeUpView>

        {/* ── BLOCO 4 — ASSISTENTE NUTRICIONAL IA ────────── */}
        {/* TESTE: título fora do bloco estilo Spotify — para reverter, troque pelo <AIChatBlock> abaixo */}
        <FadeUpView delay={360}>
          <View style={aiOpenStyles.section}>
            {/* Título + NeuralMesh fora do card */}
            <View style={aiOpenStyles.header}>
              <NeuralMesh />
              <View style={aiOpenStyles.headerText}>
                <Text style={aiOpenStyles.title}>Tire suas dúvidas</Text>
                <Text style={aiOpenStyles.subtitle}>Assistente nutricional IA</Text>
              </View>
            </View>

            {/* Card compacto de input */}
            <TouchableOpacity
              style={aiOpenStyles.inputCard}
              onPress={() => {/* abre modal — conectar ao AIChatBlock na V2 */}}
              activeOpacity={0.85}
            >
              <View style={aiOpenStyles.inputRow}>
                <Sparkles size={14} color={Colors.accent} strokeWidth={2} />
                <Text style={aiOpenStyles.inputPlaceholder}>Faça uma pergunta sobre nutrição...</Text>
              </View>
              <View style={aiOpenStyles.sendBtn}>
                <Send size={14} color="#000" strokeWidth={2.5} />
              </View>
            </TouchableOpacity>
          </View>
        </FadeUpView>
        {/* <FadeUpView delay={360}><AIChatBlock userName={mockUser.name} /></FadeUpView> */}

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

// ─── AI Open Styles (teste — título fora do bloco) ───────────────────────────

const aiOpenStyles = StyleSheet.create({
  section: {
    gap: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: 2,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  inputCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    gap: Spacing.sm,
  },
  inputRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputPlaceholder: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ─── Meal Card Styles ────────────────────────────────────────────────────────

const mealCardStyles = StyleSheet.create({
  wrapper: {
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    height: 200,
  },
  image: {
    flex: 1,
  },
  imageStyle: {
    borderRadius: BorderRadius.card,
  },
  overlay: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'flex-end',
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
  },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  badgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  macroRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  macroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(200,255,0,0.18)',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(200,255,0,0.3)',
  },
  macroLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.accent,
  },
  macroValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  kcal: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
  },
});

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
