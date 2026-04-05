import type { User, WeightRecord, BioimpedanceRecord } from '@/types';

export const mockUser: User & {
  email: string;
  avatar: null;
  caloriesBurned: number;
  weeklyGoalKcal: number;
} = {
  id: '1',
  name: 'Marina',
  email: 'marina@email.com',
  avatar: null,
  startWeight: 85.0,
  currentWeight: 76.5,
  goalWeight: 68.0,
  lastWeightDate: '01/04/2026',
  caloriesBurned: 6400,
  weeklyGoalKcal: 1800,
};

export const mockWeightHistory: WeightRecord[] = [
  { date: '01/02/2026', weight: 85.0, week: 'Sem 1' },
  { date: '08/02/2026', weight: 83.8, week: 'Sem 2' },
  { date: '15/02/2026', weight: 82.5, week: 'Sem 3' },
  { date: '22/02/2026', weight: 81.2, week: 'Sem 4' },
  { date: '01/03/2026', weight: 80.0, week: 'Sem 5' },
  { date: '08/03/2026', weight: 79.1, week: 'Sem 6' },
  { date: '15/03/2026', weight: 77.8, week: 'Sem 7' },
  { date: '22/03/2026', weight: 76.5, week: 'Sem 8' },
];

export const mockBioimpedance: BioimpedanceRecord = {
  date: '15/03/2026',
  bodyFatPercentage: 28.4,
  leanMass: 54.8,
  fatMass: 21.7,
  bodyWater: 52.3,
  metabolicRate: 1620,
  bmi: 27.1,
};
