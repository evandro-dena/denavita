import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Zap, ZapOff, Images, X, RefreshCcw } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

const { width: SW, height: SH } = Dimensions.get('window');

// Viewfinder box size
const VF_SIZE = SW * 0.72;
// Viewfinder position (centralizado na tela)
const VF_LEFT = (SW - VF_SIZE) / 2;
const VF_TOP  = (SH - VF_SIZE) / 2;
// Corner arm length
const CORNER_LEN = 28;
// Corner thickness
const CORNER_T = 4;
// Corner border-radius
const CORNER_R = 6;

// ─── Mock scan result ────────────────────────────────────────────────────────
const MOCK_RESULT = {
  name: 'Salada Caesar com Frango',
  calories: 320,
  protein: 28,
  carbs: 15,
  fat: 18,
};

// ─── Corner piece ────────────────────────────────────────────────────────────
// vTop/vBottom: posição vertical do canto no viewfinder
// vLeft/vRight: posição horizontal do canto no viewfinder
function Corner({
  vTop, vBottom, vLeft, vRight,
}: {
  vTop?: boolean; vBottom?: boolean; vLeft?: boolean; vRight?: boolean;
}) {
  const isBottom = vBottom !== undefined;
  const isRight  = vRight !== undefined;

  return (
    <View
      style={[
        cornerStyles.base,
        isBottom ? { bottom: 0 } : { top: 0 },
        isRight  ? { right: 0 } : { left: 0 },
      ]}
    >
      {/* Braço horizontal — fica na borda V do canto (topo ou base) */}
      <View
        style={[
          cornerStyles.arm,
          {
            width: CORNER_LEN,
            height: CORNER_T,
            // topo do container se canto superior, base se canto inferior
            ...(isBottom ? { bottom: 0 } : { top: 0 }),
            // esquerda se canto esq, direita se canto dir
            ...(isRight ? { right: 0 } : { left: 0 }),
          },
        ]}
      />
      {/* Braço vertical — fica na borda H do canto (esq ou dir) */}
      <View
        style={[
          cornerStyles.arm,
          {
            width: CORNER_T,
            height: CORNER_LEN,
            ...(isBottom ? { bottom: 0 } : { top: 0 }),
            ...(isRight ? { right: 0 } : { left: 0 }),
          },
        ]}
      />
    </View>
  );
}

const cornerStyles = StyleSheet.create({
  base: {
    position: 'absolute',
    width: CORNER_LEN + CORNER_T,
    height: CORNER_LEN + CORNER_T,
  },
  arm: {
    position: 'absolute',
    backgroundColor: Colors.accent,
    borderRadius: CORNER_R,
  },
});

// ─── Scan line animation ─────────────────────────────────────────────────────
function ScanLine() {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(VF_SIZE - 4, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[scanLineStyles.line, animStyle]} pointerEvents="none" />
  );
}

const scanLineStyles = StyleSheet.create({
  line: {
    position: 'absolute',
    left: 2,
    right: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.accent,
    opacity: 0.6,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
});

// ─── Result card ─────────────────────────────────────────────────────────────
interface ResultCardProps {
  onReset: () => void;
}
function ResultCard({ onReset }: ResultCardProps) {
  const translateY = useSharedValue(120);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 380, easing: Easing.out(Easing.cubic) });
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[resultStyles.container, animStyle]}>
      {/* Food color block placeholder */}
      <View style={resultStyles.imagePlaceholder}>
        <Text style={resultStyles.imagePlaceholderText}>🥗</Text>
      </View>

      {/* Info */}
      <View style={resultStyles.info}>
        <Text style={resultStyles.foodName} numberOfLines={2}>
          {MOCK_RESULT.name}
        </Text>

        {/* Kcal badge */}
        <View style={resultStyles.kcalBadge}>
          <Text style={resultStyles.kcalText}>{MOCK_RESULT.calories} kcal</Text>
        </View>

        {/* Macro row */}
        <View style={resultStyles.macroRow}>
          <MacroTag label="P" value={`${MOCK_RESULT.protein}g`} color={Colors.accent} />
          <MacroTag label="C" value={`${MOCK_RESULT.carbs}g`} color="#52A8FF" />
          <MacroTag label="L" value={`${MOCK_RESULT.fat}g`} color="#FFB74D" />
        </View>

        {/* Reset button */}
        <TouchableOpacity style={resultStyles.resetBtn} onPress={onReset} activeOpacity={0.8}>
          <RefreshCcw size={14} color={Colors.accent} strokeWidth={2} />
          <Text style={resultStyles.resetText}>Escanear Novamente</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

function MacroTag({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[macroTagStyles.tag, { borderColor: color + '40' }]}>
      <Text style={[macroTagStyles.label, { color }]}>{label}:</Text>
      <Text style={macroTagStyles.value}>{value}</Text>
    </View>
  );
}

const macroTagStyles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    backgroundColor: '#1E1E1E',
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  value: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.text,
  },
});

const resultStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#161616',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.md,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#252525',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    flexShrink: 0,
  },
  imagePlaceholderText: {
    fontSize: 36,
  },
  info: {
    flex: 1,
    gap: 8,
  },
  foodName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    color: Colors.text,
    lineHeight: 20,
  },
  kcalBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentFaded,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(200,255,0,0.25)',
  },
  kcalText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.accent,
  },
  macroRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  resetText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.accent,
  },
});

// ─── Placeholder (no camera) ─────────────────────────────────────────────────
function CameraPlaceholder({ onCapture }: { onCapture: () => void }) {
  return (
    <View style={placeholderStyles.container}>
      <View style={placeholderStyles.frame}>
        <Text style={placeholderStyles.icon}>📷</Text>
        <Text style={placeholderStyles.title}>Câmera indisponível</Text>
        <Text style={placeholderStyles.sub}>
          No simulador a câmera não está disponível.{'\n'}
          Toque em capturar para simular o scan.
        </Text>
        <TouchableOpacity style={placeholderStyles.btn} onPress={onCapture} activeOpacity={0.8}>
          <Text style={placeholderStyles.btnText}>Simular Captura</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const placeholderStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  frame: {
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
  },
  icon: { fontSize: 56 },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    color: Colors.text,
  },
  sub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  btn: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.input,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
  },
  btnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    color: '#000',
  },
});

// ─── Main Screen ─────────────────────────────────────────────────────────────
type ScreenState = 'idle' | 'loading' | 'result';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<FlashMode>('off');
  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const cameraRef = useRef<CameraView>(null);

  // Loading pulse
  const loadingOpacity = useSharedValue(1);
  const loadingAnimStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
  }));

  function startLoading() {
    // TODO: conectar API — scanService.analyzeFood(imageUri)
    setScreenState('loading');
    loadingOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 400 }),
        withTiming(1, { duration: 400 })
      ),
      -1,
      true
    );
    setTimeout(() => {
      loadingOpacity.value = 1;
      setScreenState('result');
    }, 1500);
  }

  function handleReset() {
    setScreenState('idle');
  }

  async function handleGallery() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!res.canceled) {
      startLoading();
    }
  }

  // Camera not available or permission denied
  const cameraAvailable = Platform.OS !== 'web';
  const hasPermission = permission?.granted;

  return (
    <View style={styles.root}>
      {/* ── CAMERA / PLACEHOLDER ──────────────────────── */}
      {cameraAvailable && hasPermission ? (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
          flash={flash}
        />
      ) : cameraAvailable && !hasPermission ? (
        <View style={styles.permissionScreen}>
          <CameraPlaceholder onCapture={startLoading} />
        </View>
      ) : (
        <View style={styles.permissionScreen}>
          <CameraPlaceholder onCapture={startLoading} />
        </View>
      )}

      {/* Request permission if not asked yet */}
      {cameraAvailable && permission && !permission.granted && !permission.canAskAgain && null}
      {cameraAvailable && permission && !permission.granted && permission.canAskAgain && (
        <View style={styles.permissionOverlay}>
          <Text style={styles.permissionText}>
            Precisamos de acesso à câmera para escanear alimentos.
          </Text>
          <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionBtnText}>Permitir câmera</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── SAFE UI LAYER ────────────────────────────── */}
      <SafeAreaView style={StyleSheet.absoluteFill} edges={['top', 'bottom']} pointerEvents="box-none">
        {/* Header */}
        <View style={styles.header}>
          {/* Flash toggle */}
          <View style={{ width: 40 }} />
          <Text style={styles.headerTitle}>Scan</Text>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setFlash(f => (f === 'off' ? 'on' : 'off'))}
          >
            {flash === 'on'
              ? <Zap size={20} color={Colors.accent} strokeWidth={2} />
              : <ZapOff size={20} color="#fff" strokeWidth={1.8} />
            }
          </TouchableOpacity>
        </View>

        {/* ── OVERLAY: 4 retângulos cobrem tudo exceto o viewfinder ── */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Topo */}
          <View style={[styles.dimRect, { top: 0, left: 0, right: 0, height: VF_TOP }]} />
          {/* Base */}
          <View style={[styles.dimRect, { top: VF_TOP + VF_SIZE, left: 0, right: 0, bottom: 0 }]} />
          {/* Esquerda */}
          <View style={[styles.dimRect, { top: VF_TOP, left: 0, width: VF_LEFT, height: VF_SIZE }]} />
          {/* Direita */}
          <View style={[styles.dimRect, { top: VF_TOP, left: VF_LEFT + VF_SIZE, right: 0, height: VF_SIZE }]} />
        </View>

        {/* ── VIEWFINDER (cantos + scan line) ── */}
        <View style={styles.viewfinder} pointerEvents="none">
          <Corner vTop vLeft />
          <Corner vTop vRight />
          <Corner vBottom vLeft />
          <Corner vBottom vRight />

          {screenState === 'idle' && <ScanLine />}

          {screenState === 'loading' && (
            <Animated.View style={[styles.loadingBox, loadingAnimStyle]}>
              <ActivityIndicator size="large" color={Colors.accent} />
              <Text style={styles.loadingText}>Analisando...</Text>
            </Animated.View>
          )}
        </View>

        {/* Hint text */}
        {screenState === 'idle' && (
          <View style={styles.hintRow} pointerEvents="none">
            <Text style={styles.hintText}>
              Posicione o alimento dentro do quadro
            </Text>
          </View>
        )}

        {/* ── BOTTOM CONTROLS ──────────────────────────── */}
        {screenState !== 'result' && (
          <View style={styles.controls}>
            {/* Gallery */}
            <TouchableOpacity style={styles.iconBtn} onPress={handleGallery}>
              <Images size={24} color="#fff" strokeWidth={1.8} />
            </TouchableOpacity>

            {/* Shutter */}
            <TouchableOpacity
              style={styles.shutter}
              onPress={startLoading}
              disabled={screenState === 'loading'}
              activeOpacity={0.85}
            >
              <View style={styles.shutterInner} />
            </TouchableOpacity>

            {/* Placeholder spacer */}
            <View style={{ width: 44 }} />
          </View>
        )}
      </SafeAreaView>

      {/* ── RESULT CARD ──────────────────────────────── */}
      {screenState === 'result' && <ResultCard onReset={handleReset} />}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const DIM_COLOR = 'rgba(0,0,0,0.62)';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionScreen: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  permissionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  permissionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.text,
    textAlign: 'center',
  },
  permissionBtn: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.input,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
  },
  permissionBtnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15,
    color: '#000',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  headerTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 17,
    color: '#fff',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Overlay retângulos ao redor do viewfinder
  dimRect: {
    position: 'absolute',
    backgroundColor: DIM_COLOR,
  },

  // Viewfinder box (centralizado absolutamente na tela)
  viewfinder: {
    position: 'absolute',
    top: VF_TOP,
    left: VF_LEFT,
    width: VF_SIZE,
    height: VF_SIZE,
  },

  // Hint (abaixo do viewfinder)
  hintRow: {
    position: 'absolute',
    top: VF_TOP + VF_SIZE,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  hintText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
  },

  // Loading
  loadingBox: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  loadingText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.accent,
  },

  // Bottom controls — fixado abaixo do viewfinder
  controls: {
    position: 'absolute',
    top: VF_TOP + VF_SIZE + Spacing.xl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
  },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
  },
});
