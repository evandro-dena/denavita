// ─── Core design tokens ───────────────────────────────────────────────────────

export const Colors = {
  // Backgrounds
  background: '#111111',
  surface: '#1A1A1A',
  surfaceLight: '#222222',
  surfaceBorder: '#2A2A2A',

  // Accent — verde-limão DenaVita
  accent: '#C8FF00',
  accentFaded: 'rgba(200, 255, 0, 0.12)',
  accentDim: 'rgba(200, 255, 0, 0.06)',

  // Text
  text: '#FFFFFF',
  textSecondary: '#888888',
  textMuted: '#555555',

  // Semantic
  success: '#C8FF00',
  warning: '#F59E0B',
  danger: '#EF4444',

  // Borders
  border: '#2A2A2A',
  borderLight: 'rgba(255,255,255,0.06)',

  // Tab bar
  tabActive: '#C8FF00',
  tabInactive: '#666666',

  // ── Backward-compat aliases (usadas por componentes legados) ──────────────
  primary: '#C8FF00',
  primaryLight: '#C8FF00',
  primaryFaded: 'rgba(200, 255, 0, 0.12)',
  surfaceGradientStart: '#1A1A1A',
  surfaceGradientEnd: '#111111',
  cardBorder: '#2A2A2A',
};

export const Typography = {
  // Poppins — títulos
  h1: { fontSize: 28, fontFamily: 'Poppins_700Bold' },
  h2: { fontSize: 22, fontFamily: 'Poppins_700Bold' },
  h3: { fontSize: 18, fontFamily: 'Poppins_600SemiBold' },
  h4: { fontSize: 15, fontFamily: 'Poppins_600SemiBold' },

  // Inter — body
  body: { fontSize: 15, fontFamily: 'Inter_400Regular' },
  bodyMedium: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  caption: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  captionMedium: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  label: { fontSize: 11, fontFamily: 'Inter_500Medium', letterSpacing: 0.5 },

  // Backward-compat
  heading1: { fontSize: 28, fontWeight: 'bold' as const },
  heading2: { fontSize: 22, fontWeight: 'bold' as const },
  heading3: { fontSize: 18, fontWeight: '600' as const },
  body2: { fontSize: 15, fontWeight: '400' as const },
  caption2: { fontSize: 13, fontWeight: '400' as const },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  input: 12,
  card: 20,
  pill: 100,
  sm: 8,
  md: 12,
  lg: 16,
};
