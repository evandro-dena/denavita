import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  Camera,
  ChevronRight,
  Star,
  X,
  Globe,
  FileText,
  Lock,
  LogOut,
  Check,
} from 'lucide-react-native';
import { mockUser } from '@/mocks/userData';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

// ─── Types ───────────────────────────────────────────────────────────────────

type Language = 'Português' | 'English' | 'Español';
const LANGUAGES: Language[] = ['Português', 'English', 'Español'];

// ─── Option Card ─────────────────────────────────────────────────────────────

interface OptionCardProps {
  emoji: string;
  label: string;
  rightLabel?: string;
  onPress: () => void;
  danger?: boolean;
  hideChevron?: boolean;
}

function OptionCard({
  emoji,
  label,
  rightLabel,
  onPress,
  danger = false,
  hideChevron = false,
}: OptionCardProps) {
  return (
    <TouchableOpacity
      style={optStyles.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={optStyles.left}>
        <View style={optStyles.emojiBox}>
          <Text style={optStyles.emoji}>{emoji}</Text>
        </View>
        <Text style={[optStyles.label, danger && optStyles.labelDanger]}>
          {label}
        </Text>
      </View>
      <View style={optStyles.right}>
        {rightLabel && (
          <Text style={optStyles.rightLabel}>{rightLabel}</Text>
        )}
        {!hideChevron && !danger && (
          <ChevronRight size={16} color={Colors.textMuted} strokeWidth={2} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const optStyles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  emojiBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#252525',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 18 },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: Colors.text,
  },
  labelDanger: {
    color: '#FF5252',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rightLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
});

// ─── Language Modal ───────────────────────────────────────────────────────────

function LanguageModal({
  visible,
  current,
  onSelect,
  onClose,
}: {
  visible: boolean;
  current: Language;
  onSelect: (l: Language) => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={modalStyles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={modalStyles.sheet}>
          <View style={modalStyles.handle} />
          <Text style={modalStyles.sheetTitle}>Idioma</Text>

          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang}
              style={langStyles.row}
              onPress={() => { onSelect(lang); onClose(); }}
              activeOpacity={0.75}
            >
              <Text style={[langStyles.label, lang === current && langStyles.labelActive]}>
                {lang === 'Português' ? '🇧🇷' : lang === 'English' ? '🇺🇸' : '🇪🇸'}{' '}
                {lang}
              </Text>
              {lang === current && (
                <View style={langStyles.checkCircle}>
                  <Check size={12} color="#000" strokeWidth={3} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const langStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.textSecondary,
  },
  labelActive: {
    fontFamily: 'Inter_500Medium',
    color: Colors.text,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ─── Rating Modal ─────────────────────────────────────────────────────────────

function RatingModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState('');

  function handleSubmit() {
    // TODO: conectar API — feedbackService.sendFeedback({ stars, message })
    if (stars === 0) {
      Alert.alert('Selecione uma avaliação', 'Por favor, toque em uma estrela para avaliar.');
      return;
    }
    onClose();
    setStars(0);
    setFeedback('');
    setTimeout(() => {
      Alert.alert('Obrigado! 🎉', 'Seu feedback foi enviado com sucesso.');
    }, 300);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={modalStyles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[modalStyles.sheet, { gap: Spacing.md }]}>
          <View style={modalStyles.handle} />

          {/* Header */}
          <View style={ratingStyles.header}>
            <Text style={modalStyles.sheetTitle}>Avaliar o DenaVita</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={ratingStyles.sub}>
            Sua opinião nos ajuda a melhorar cada vez mais!
          </Text>

          {/* Stars */}
          <View style={ratingStyles.starsRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity key={n} onPress={() => setStars(n)} activeOpacity={0.7}>
                <Star
                  size={40}
                  color={n <= stars ? '#FFB74D' : Colors.border}
                  fill={n <= stars ? '#FFB74D' : 'transparent'}
                  strokeWidth={1.5}
                />
              </TouchableOpacity>
            ))}
          </View>

          {stars > 0 && (
            <Text style={ratingStyles.starLabel}>
              {['', 'Muito ruim', 'Ruim', 'Regular', 'Bom', 'Excelente!'][stars]}
            </Text>
          )}

          {/* Feedback text */}
          <View style={ratingStyles.inputBox}>
            <TextInput
              style={ratingStyles.input}
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Conte como está sua experiência..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={ratingStyles.submitBtn}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={ratingStyles.submitText}>Enviar Feedback</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const ratingStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: -8,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  starLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: -4,
  },
  inputBox: {
    backgroundColor: '#222',
    borderRadius: BorderRadius.input,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    minHeight: 100,
  },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  submitBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    color: '#000',
  },
});

// Shared modal styles
const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 44 : Spacing.lg,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
  sheetTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: Colors.text,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('Português');
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);

  async function handlePickAvatar() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso às suas fotos para alterar o avatar.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  }

  function handleLogout() {
    // TODO: conectar API — authService.logout() + limpar token do SecureStore
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair? Você precisará fazer login novamente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => router.replace('/login'),
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── AVATAR SECTION ─────────────────────────────── */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={handlePickAvatar}
            activeOpacity={0.85}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>M</Text>
              </View>
            )}

            {/* Camera overlay badge */}
            <View style={styles.cameraBtn}>
              <Camera size={14} color="#000" strokeWidth={2.5} />
            </View>
          </TouchableOpacity>

          <Text style={styles.userName}>Marina Silva</Text>
          <Text style={styles.userEmail}>{mockUser.email}</Text>
        </View>

        {/* ── OPTIONS ────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Preferências</Text>
          <View style={styles.cardGroup}>
            <OptionCard
              emoji="🌐"
              label="Idioma"
              rightLabel={language}
              onPress={() => setLangModalOpen(true)}
            />
            <OptionCard
              emoji="⭐"
              label="Avaliar App"
              onPress={() => setRatingModalOpen(true)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Legal</Text>
          <View style={styles.cardGroup}>
            <OptionCard
              emoji="📄"
              label="Termos de Uso"
              onPress={() => router.push('/terms')}
            />
            <OptionCard
              emoji="🔒"
              label="Política de Privacidade"
              onPress={() => router.push('/privacy')}
            />
          </View>
        </View>

        {/* ── LOGOUT ─────────────────────────────────────── */}
        <View style={styles.section}>
          <OptionCard
            emoji="❌"
            label="Sair da Conta"
            onPress={handleLogout}
            danger
            hideChevron
          />
        </View>

        {/* App version */}
        <Text style={styles.version}>DenaVita v1.0.0</Text>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      {/* Modals */}
      <LanguageModal
        visible={langModalOpen}
        current={language}
        onSelect={setLanguage}
        onClose={() => setLangModalOpen(false)}
      />
      <RatingModal
        visible={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
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
  scroll: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    gap: Spacing.lg,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    gap: 8,
    paddingBottom: Spacing.sm,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 4,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accentFaded,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  avatarInitial: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 40,
    color: Colors.accent,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  userName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    color: Colors.text,
  },
  userEmail: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#888888',
  },

  // Sections
  section: {
    gap: Spacing.sm,
  },
  sectionLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingLeft: 4,
  },
  cardGroup: {
    gap: 8,
  },

  // Version
  version: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
