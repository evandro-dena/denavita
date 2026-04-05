import { memo, useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// ─── Config ──────────────────────────────────────────────────────────────────
const SIZE = 130;
const CX = SIZE / 2;
const CY = SIZE / 2;
const NUCLEUS_R = 48;
const NODE_COUNT = 32;      // reduzido de 55 → 32 (~496 pares vs ~1485)
const CONNECT_DIST = 58;
const ACCENT = '#C8FF00';
const FPS = 30;             // throttle
const INTERVAL_MS = 1000 / FPS;
const SPEED = 2.5;          // multiplicador global de velocidade

// ─── Seed random ─────────────────────────────────────────────────────────────
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

interface NodeDef {
  bx: number;
  by: number;
  ax: number;
  ay: number;
  phase: number;
  freq: number;
}

function buildNodes(): NodeDef[] {
  const rand = seededRand(7);
  return Array.from({ length: NODE_COUNT }, () => {
    const angle = rand() * Math.PI * 2;
    const r = Math.pow(rand(), 0.5) * NUCLEUS_R;
    return {
      bx: Math.cos(angle) * r,
      by: Math.sin(angle) * r,
      ax: 3 + rand() * 7,
      ay: 3 + rand() * 7,
      phase: rand() * Math.PI * 2,
      freq: 0.4 + rand() * 0.7,
    };
  });
}

const NODES = buildNodes();

// ─── Componente ──────────────────────────────────────────────────────────────
function NeuralMeshBase() {
  const [t, setT] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setT((Date.now() - startRef.current) / 1000);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const ts = t * SPEED;

  const pos = NODES.map((n) => ({
    x: CX + n.bx + Math.sin(ts * n.freq + n.phase) * n.ax,
    y: CY + n.by + Math.cos(ts * n.freq * 0.8 + n.phase + 1.1) * n.ay,
  }));

  const paths: { d: string; opacity: number }[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      const dx = pos[i].x - pos[j].x;
      const dy = pos[i].y - pos[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > CONNECT_DIST) continue;

      const opacity = Math.pow(1 - dist / CONNECT_DIST, 1.2) * 0.7;

      const mx = (pos[i].x + pos[j].x) / 2;
      const my = (pos[i].y + pos[j].y) / 2;
      const perp = Math.sin(ts * 0.5 + i * 0.3 + j * 0.2) * (dist * 0.2);
      const len = dist || 1;
      const cpx = mx + (-dy / len) * perp;
      const cpy = my + (dx / len) * perp;

      paths.push({
        d: `M ${pos[i].x.toFixed(1)} ${pos[i].y.toFixed(1)} Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${pos[j].x.toFixed(1)} ${pos[j].y.toFixed(1)}`,
        opacity,
      });
    }
  }

  return (
    <View style={styles.wrapper}>
      <Svg width={SIZE} height={SIZE}>
        {paths.map((p, i) => (
          <Path
            key={i}
            d={p.d}
            stroke={ACCENT}
            strokeWidth={0.65}
            strokeOpacity={p.opacity}
            fill="none"
          />
        ))}
      </Svg>
    </View>
  );
}

export default memo(NeuralMeshBase);

const styles = StyleSheet.create({
  wrapper: {
    width: SIZE,
    height: SIZE,
    alignSelf: 'center',
    marginVertical: 4,
  },
});
