import { Fragment, useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { mockWeightHistory } from '@/mocks/userData';

// ─── Config ──────────────────────────────────────────────────────────────────

const CHART_H = 180;
const PAD = { top: 16, right: 20, bottom: 34, left: 40 };
const WEEKLY_LOSS = 0.75; // kg/semana (média entre 0,5 e 1,0)

const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseDate(ddmmyyyy: string): Date {
  const [d, m, y] = ddmmyyyy.split('/').map(Number);
  return new Date(y, m - 1, d);
}

// ─── Componente ──────────────────────────────────────────────────────────────

interface Props {
  currentWeight: number;
  startWeight: number;
  goalWeight: number;
}

/**
 * Gráfico de linha: peso × tempo
 * - Linha contínua verde (#C8FF00): histórico real
 * - Linha tracejada branca: estimativa até a meta (0,75 kg/semana)
 *
 * TODO V2: substituir mockWeightHistory por dados reais da API
 *          e usar new Date() no lugar da data mock de hoje
 */
export default function WeightLineChart({ currentWeight, startWeight, goalWeight }: Props) {
  const { width: screenW } = useWindowDimensions();

  // Largura disponível: margem horizontal da tela (32) + padding do card (32)
  const CHART_W = screenW - 64;
  const CW = CHART_W - PAD.left - PAD.right;
  const CH = CHART_H - PAD.top - PAD.bottom;

  const chart = useMemo(() => {
    // Data de referência — trocar por new Date() ao conectar API
    const today = new Date(2026, 3, 5); // 05/04/2026

    // Histórico real
    const history = mockWeightHistory.map((r) => ({
      date: parseDate(r.date),
      weight: r.weight,
    }));

    // Adiciona ponto de hoje com o peso atual (pode ter mudado via modal)
    const last = history[history.length - 1];
    if (
      last.date.getTime() !== today.getTime() ||
      last.weight !== currentWeight
    ) {
      history.push({ date: today, weight: currentWeight });
    }

    // Estimativa de término
    const weeksLeft = Math.max((currentWeight - goalWeight) / WEEKLY_LOSS, 0);
    const estimatedEnd = new Date(today);
    estimatedEnd.setDate(today.getDate() + Math.ceil(weeksLeft * 7));

    // Limites do eixo
    const startDate = history[0].date;
    const endDate = estimatedEnd;
    const totalMs = endDate.getTime() - startDate.getTime();
    const minW = goalWeight - 2;
    const maxW = startWeight + 2;
    const wRange = maxW - minW;

    // Funções de mapeamento
    const xOf = (date: Date) =>
      PAD.left + ((date.getTime() - startDate.getTime()) / totalMs) * CW;
    const yOf = (w: number) => PAD.top + ((maxW - w) / wRange) * CH;

    // Path da linha real
    const actualPath = history
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.date).toFixed(1)} ${yOf(p.weight).toFixed(1)}`)
      .join(' ');

    // Path da estimativa (de hoje até meta)
    const estimatePath = [
      `M ${xOf(today).toFixed(1)} ${yOf(currentWeight).toFixed(1)}`,
      `L ${xOf(estimatedEnd).toFixed(1)} ${yOf(goalWeight).toFixed(1)}`,
    ].join(' ');

    // Rótulos do eixo X (início de cada mês dentro do intervalo)
    const xLabels: { x: number; label: string }[] = [];
    const monthCursor = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
    while (monthCursor <= endDate) {
      const x = xOf(monthCursor);
      if (x >= PAD.left && x <= PAD.left + CW) {
        xLabels.push({ x, label: MONTHS_PT[monthCursor.getMonth()] });
      }
      monthCursor.setMonth(monthCursor.getMonth() + 1);
    }

    // Rótulos do eixo Y (a cada 5 kg)
    const step = 5;
    const yLabels: { y: number; label: string }[] = [];
    const firstMark = Math.ceil(minW / step) * step;
    for (let w = firstMark; w <= maxW; w += step) {
      yLabels.push({ y: yOf(w), label: `${w}` });
    }

    const currentDot = { x: xOf(today), y: yOf(currentWeight) };
    const goalDot   = { x: xOf(estimatedEnd), y: yOf(goalWeight) };

    // Estimativa de tempo restante em meses para exibir abaixo
    const monthsLeft = Math.ceil(weeksLeft / 4.33);

    return {
      actualPath,
      estimatePath,
      xLabels,
      yLabels,
      currentDot,
      goalDot,
      monthsLeft,
    };
  }, [currentWeight, goalWeight, startWeight, CW, CH]);

  return (
    <View style={styles.container}>
      <Svg width={CHART_W} height={CHART_H}>
        {/* ── Grade horizontal + rótulos Y ───────────────────── */}
        {chart.yLabels.map(({ y, label }) => (
          <Fragment key={label}>
            <Line
              x1={PAD.left} y1={y}
              x2={PAD.left + CW} y2={y}
              stroke="#2A2A2A"
              strokeWidth={1}
            />
            <SvgText
              x={PAD.left - 6}
              y={y + 4}
              fontSize={10}
              fill="#555555"
              textAnchor="end"
            >
              {label}
            </SvgText>
          </Fragment>
        ))}

        {/* ── Rótulos X (meses) ───────────────────────────────── */}
        {chart.xLabels.map(({ x, label }) => (
          <SvgText
            key={label}
            x={x}
            y={CHART_H - 8}
            fontSize={10}
            fill="#555555"
            textAnchor="middle"
          >
            {label}
          </SvgText>
        ))}

        {/* ── Linha tracejada — estimativa ────────────────────── */}
        <Path
          d={chart.estimatePath}
          stroke="rgba(255,255,255,0.30)"
          strokeWidth={1.5}
          strokeDasharray="5 4"
          fill="none"
        />

        {/* ── Dot na meta ─────────────────────────────────────── */}
        <Circle
          cx={chart.goalDot.x}
          cy={chart.goalDot.y}
          r={4}
          fill="#1A1A1A"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth={1.5}
        />

        {/* ── Linha contínua — histórico real ─────────────────── */}
        <Path
          d={chart.actualPath}
          stroke={Colors.accent}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ── Dot atual ───────────────────────────────────────── */}
        <Circle cx={chart.currentDot.x} cy={chart.currentDot.y} r={9} fill="rgba(200,255,0,0.15)" />
        <Circle cx={chart.currentDot.x} cy={chart.currentDot.y} r={5} fill={Colors.accent} />
      </Svg>

      {/* ── Legenda ─────────────────────────────────────────────── */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: Colors.accent }]} />
          <Text style={styles.legendLabel}>Progresso real</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendDashed} />
          <Text style={styles.legendLabel}>
            Estimativa · ~{chart.monthsLeft} {chart.monthsLeft === 1 ? 'mês' : 'meses'}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  legend: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingLeft: PAD.left,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendLine: {
    width: 18,
    height: 2,
    borderRadius: 1,
  },
  legendDashed: {
    width: 18,
    height: 2,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderStyle: 'dashed',
  },
  legendLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#555555',
  },
});
