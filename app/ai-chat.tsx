import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import NeuralMesh from '@/components/ui/NeuralMesh';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

// ─── Dúvidas frequentes ──────────────────────────────────────────────────────

// 2 na primeira linha, 3 na segunda
const QUESTIONS_ROW1 = [
  { emoji: '🥩', text: 'Proteínas por dia?' },
  { emoji: '🔥', text: 'Déficit calórico?' },
];
const QUESTIONS_ROW2 = [
  { emoji: '💧', text: 'Água por dia?' },
  { emoji: '🍌', text: 'Fruta à noite?' },
  { emoji: '🏋️', text: 'Antes do treino?' },
];

// ─── Componente ──────────────────────────────────────────────────────────────

export default function AIChatScreen() {
  const [inputText, setInputText] = useState('');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backBtn}
        >
          <ArrowLeft size={20} color={Colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>IA Nutricional</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── NEURO + TEXTO ── */}
          <View style={styles.heroSection}>
            <NeuralMesh />
            <Text style={styles.heroTitle}>Tire suas dúvidas</Text>
            <Text style={styles.heroSub}>
              Selecione uma pergunta abaixo ou escreva a sua
            </Text>
          </View>

          {/* ── DÚVIDAS FREQUENTES ── */}
          <Text style={styles.sectionLabel}>Dúvidas frequentes</Text>
          <View style={styles.questionsGrid}>
            {/* Linha 1 — 2 pílulas */}
            <View style={styles.questionsRow}>
              {QUESTIONS_ROW1.map((q) => (
                <TouchableOpacity
                  key={q.text}
                  style={styles.questionCard}
                  activeOpacity={0.75}
                  onPress={() => setInputText(q.text)}
                >
                  <Text style={styles.questionEmoji}>{q.emoji}</Text>
                  <Text style={styles.questionText} numberOfLines={1}>{q.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Linha 2 — 3 pílulas */}
            <View style={styles.questionsRow}>
              {QUESTIONS_ROW2.map((q) => (
                <TouchableOpacity
                  key={q.text}
                  style={styles.questionCard}
                  activeOpacity={0.75}
                  onPress={() => setInputText(q.text)}
                >
                  <Text style={styles.questionEmoji}>{q.emoji}</Text>
                  <Text style={styles.questionText} numberOfLines={1}>{q.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── AVISO V1 ── */}
          <Text style={styles.v1Text}>🚧 IA completa disponível em breve na V2</Text>
        </ScrollView>

        {/* ── INPUT FIXO NA BASE ── */}
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Faça uma pergunta sobre nutrição..."
            placeholderTextColor={Colors.textMuted}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnOff]}
            disabled={!inputText.trim()}
            activeOpacity={0.8}
          >
            <Send size={16} color="#000" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
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
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: Colors.text,
  },

  // Hero
  scroll: {
    paddingBottom: 4,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: 6,
  },
  heroTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    color: Colors.text,
    textAlign: 'center',
  },
  heroSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Section label
  sectionLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },

  // Questions grid — 2 linhas fixas
  questionsGrid: {
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  questionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  questionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexShrink: 1,
  },
  questionEmoji: {
    fontSize: 14,
  },
  questionText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.text,
    flexShrink: 1,
  },

  v1Text: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },

  // Input
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 8 : Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.surface,
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
  sendBtnOff: {
    backgroundColor: Colors.border,
  },
});
