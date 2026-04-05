import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '@/constants/theme';

// Gauge geometry
const CX = 120;
const CY = 112;
const R = 84;
const START_DEG = 150;   // 8 o'clock in SVG coords
const TOTAL_SWEEP = 240; // degrees swept by the full arc
const STROKE_W = 20;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** Clockwise arc path from startDeg, sweeping sweepDeg degrees */
function arcPath(startDeg: number, sweepDeg: number): string {
  if (sweepDeg <= 0) return '';
  // Clamp to avoid degenerate full-circle arcs
  const sweep = Math.min(sweepDeg, 359.9);
  const startRad = toRad(startDeg);
  const endRad = toRad(startDeg + sweep);
  const x1 = CX + R * Math.cos(startRad);
  const y1 = CY + R * Math.sin(startRad);
  const x2 = CX + R * Math.cos(endRad);
  const y2 = CY + R * Math.sin(endRad);
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

interface Props {
  currentWeight: number;
  startWeight: number;
  goalWeight: number;
}

export default function GaugeChart({ currentWeight, startWeight, goalWeight }: Props) {
  const progress = Math.max(
    0,
    Math.min(1, (startWeight - currentWeight) / (startWeight - goalWeight))
  );
  const progressSweep = TOTAL_SWEEP * progress;

  return (
    <View style={styles.wrapper}>
      {/* SVG gauge */}
      <Svg
        width={240}
        height={160}
        viewBox="0 0 240 160"
        style={styles.svg}
      >
        {/* Background track */}
        <Path
          d={arcPath(START_DEG, TOTAL_SWEEP)}
          fill="none"
          stroke="#2A2A2A"
          strokeWidth={STROKE_W}
          strokeLinecap="round"
        />
        {/* Progress fill */}
        {progressSweep > 2 && (
          <Path
            d={arcPath(START_DEG, progressSweep)}
            fill="none"
            stroke={Colors.accent}
            strokeWidth={STROKE_W}
            strokeLinecap="round"
          />
        )}
      </Svg>

      {/* Center overlay text — absolute positioned over the SVG */}
      <View style={styles.overlay} pointerEvents="none">
        <Text style={styles.weightValue}>{currentWeight}kg</Text>
        <Text style={styles.weightLabel}>Peso Atual</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 240,
    height: 160,
    alignSelf: 'center',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlay: {
    position: 'absolute',
    // Center of gauge circle is at (120, 112) in a 240x160 canvas
    // Top of text block ≈ CY - 28 ≈ 84
    top: 84,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  weightValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 32,
    color: '#FFFFFF',
    lineHeight: 38,
  },
  weightLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
});
