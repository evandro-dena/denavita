import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polyline, Circle, Line, Text as SvgText, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { WeightRecord } from '@/types';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import Card from '@/components/ui/Card';

interface WeightChartProps {
  data: WeightRecord[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CHART_W = SCREEN_WIDTH - Spacing.md * 2 - Spacing.md * 2;
const CHART_H = 170;
const PAD_TOP = 12;
const PAD_BOTTOM = 28;
const PAD_LEFT = 42;
const PAD_RIGHT = 12;

const PLOT_W = CHART_W - PAD_LEFT - PAD_RIGHT;
const PLOT_H = CHART_H - PAD_TOP - PAD_BOTTOM;

const DATA_MIN = 80;
const DATA_MAX = 92;

function xPos(index: number, total: number): number {
  return PAD_LEFT + (index / (total - 1)) * PLOT_W;
}

function yPos(value: number): number {
  return PAD_TOP + ((DATA_MAX - value) / (DATA_MAX - DATA_MIN)) * PLOT_H;
}

export default function WeightChart({ data }: WeightChartProps) {
  const weights = data.map((r) => r.weight);
  const labels = data.map((r) => r.week);
  const total = weights.length;

  const pointsStr = weights.map((w, i) => `${xPos(i, total)},${yPos(w)}`).join(' ');

  const areaPath = [
    `M ${xPos(0, total)},${yPos(weights[0])}`,
    ...weights.slice(1).map((w, i) => `L ${xPos(i + 1, total)},${yPos(w)}`),
    `L ${xPos(total - 1, total)},${PAD_TOP + PLOT_H}`,
    `L ${xPos(0, total)},${PAD_TOP + PLOT_H}`,
    'Z',
  ].join(' ');

  const gridValues = [82, 84, 86, 88, 90];

  return (
    <Card style={styles.card} padding={Spacing.md}>
      <Svg width={CHART_W} height={CHART_H}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Colors.primaryLight} stopOpacity="0.25" />
            <Stop offset="1" stopColor={Colors.primaryLight} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {gridValues.map((val) => (
          <Line
            key={val}
            x1={PAD_LEFT}
            y1={yPos(val)}
            x2={PAD_LEFT + PLOT_W}
            y2={yPos(val)}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={1}
          />
        ))}

        {gridValues.map((val) => (
          <SvgText
            key={`y-${val}`}
            x={PAD_LEFT - 6}
            y={yPos(val) + 4}
            fill={Colors.textMuted}
            fontSize={10}
            textAnchor="end"
          >
            {val}
          </SvgText>
        ))}

        <Path d={areaPath} fill="url(#grad)" />

        <Polyline
          points={pointsStr}
          fill="none"
          stroke={Colors.primaryLight}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {weights.map((w, i) => (
          <Circle
            key={i}
            cx={xPos(i, total)}
            cy={yPos(w)}
            r={4}
            fill={Colors.primaryLight}
            stroke={Colors.surface}
            strokeWidth={2}
          />
        ))}

        {labels.map((label, i) =>
          i % 2 === 0 ? (
            <SvgText
              key={`x-${i}`}
              x={xPos(i, total)}
              y={CHART_H - 6}
              fill={Colors.textMuted}
              fontSize={9}
              textAnchor="middle"
            >
              {label}
            </SvgText>
          ) : null
        )}
      </Svg>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
});
