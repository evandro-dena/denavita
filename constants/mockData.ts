import { User, BioimpedanceRecord, WeightRecord, DietPlan } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Evandro',
  startWeight: 90,
  currentWeight: 82.5,
  goalWeight: 78,
  lastWeightDate: '25 Mar 2026',
};

export const mockBioimpedance: BioimpedanceRecord = {
  date: '20 Mar 2026',
  bodyFatPercentage: 18.5,
  leanMass: 67.2,
  fatMass: 15.3,
  bodyWater: 55.8,
  metabolicRate: 1850,
  bmi: 24.2,
};

export const mockWeightHistory: WeightRecord[] = [
  { date: '2026-01-25', weight: 90, week: 'Sem 1' },
  { date: '2026-02-01', weight: 88.5, week: 'Sem 2' },
  { date: '2026-02-08', weight: 87.2, week: 'Sem 3' },
  { date: '2026-02-15', weight: 86, week: 'Sem 4' },
  { date: '2026-02-22', weight: 85.1, week: 'Sem 5' },
  { date: '2026-03-01', weight: 84, week: 'Sem 6' },
  { date: '2026-03-08', weight: 83.2, week: 'Sem 7' },
  { date: '2026-03-25', weight: 82.5, week: 'Sem 8' },
];

export const mockDietPlan: DietPlan = {
  id: '1',
  userId: '1',
  totalCalories: 2350,
  totalProtein: 180,
  totalCarbs: 245,
  totalFat: 72,
  meals: [
    {
      id: 'm1',
      name: 'Café da Manhã',
      time: '07:00',
      substitution: 'Pode trocar ovos por 150g de peito de peru',
      items: [
        { id: 'm1i1', name: '3 ovos mexidos', quantity: '180g', calories: 210, protein: 18, carbs: 2, fat: 15 },
        { id: 'm1i2', name: '2 fatias pão integral', quantity: '60g', calories: 140, protein: 6, carbs: 24, fat: 2 },
        { id: 'm1i3', name: '1 banana', quantity: '120g', calories: 105, protein: 1, carbs: 27, fat: 0 },
        { id: 'm1i4', name: 'Café preto sem açúcar', quantity: '—', calories: 5, protein: 0, carbs: 0, fat: 0 },
      ],
    },
    {
      id: 'm2',
      name: 'Lanche da Manhã',
      time: '10:00',
      items: [
        { id: 'm2i1', name: 'Whey Protein Denavita', quantity: '30g', calories: 120, protein: 24, carbs: 3, fat: 1.5 },
        { id: 'm2i2', name: '1 maçã', quantity: '150g', calories: 78, protein: 0, carbs: 20, fat: 0 },
        { id: 'm2i3', name: '10 castanhas de caju', quantity: '15g', calories: 85, protein: 3, carbs: 4, fat: 7 },
      ],
    },
    {
      id: 'm3',
      name: 'Almoço',
      time: '13:00',
      substitution: 'Frango pode ser trocado por 200g de tilápia',
      items: [
        { id: 'm3i1', name: 'Peito de frango grelhado', quantity: '200g', calories: 330, protein: 46, carbs: 0, fat: 14 },
        { id: 'm3i2', name: 'Arroz integral', quantity: '150g', calories: 180, protein: 4, carbs: 38, fat: 1.5 },
        { id: 'm3i3', name: 'Brócolis cozido', quantity: '100g', calories: 35, protein: 3, carbs: 7, fat: 0 },
        { id: 'm3i4', name: 'Salada verde à vontade', quantity: '—', calories: 15, protein: 0, carbs: 0, fat: 0 },
        { id: 'm3i5', name: 'Azeite', quantity: '10ml', calories: 90, protein: 0, carbs: 0, fat: 10 },
      ],
    },
    {
      id: 'm4',
      name: 'Lanche da Tarde',
      time: '16:00',
      items: [
        { id: 'm4i1', name: 'Iogurte grego natural', quantity: '200g', calories: 130, protein: 12, carbs: 8, fat: 6 },
        { id: 'm4i2', name: 'Granola sem açúcar', quantity: '30g', calories: 120, protein: 3, carbs: 18, fat: 4 },
        { id: 'm4i3', name: 'Mel', quantity: '15g', calories: 45, protein: 0, carbs: 12, fat: 0 },
      ],
    },
    {
      id: 'm5',
      name: 'Jantar',
      time: '19:30',
      substitution: 'Carne pode ser trocada por 200g de salmão',
      items: [
        { id: 'm5i1', name: 'Carne vermelha magra (patinho)', quantity: '200g', calories: 280, protein: 42, carbs: 0, fat: 12 },
        { id: 'm5i2', name: 'Batata doce cozida', quantity: '200g', calories: 172, protein: 2, carbs: 40, fat: 0 },
        { id: 'm5i3', name: 'Legumes refogados', quantity: '150g', calories: 60, protein: 2, carbs: 10, fat: 2 },
      ],
    },
    {
      id: 'm6',
      name: 'Ceia',
      time: '21:30',
      items: [
        { id: 'm6i1', name: 'Caseína Denavita', quantity: '30g', calories: 110, protein: 22, carbs: 4, fat: 1 },
        { id: 'm6i2', name: 'Pasta de amendoim', quantity: '20g', calories: 120, protein: 5, carbs: 3, fat: 10 },
      ],
    },
  ],
};
