import type { DietPlan } from '@/types';

export const mockMealPlan: DietPlan = {
  id: 'plan-001',
  userId: '1',
  totalCalories: 2150,
  totalProtein: 158,
  totalCarbs: 120,
  totalFat: 50,
  meals: [
    {
      id: 'meal-1',
      name: 'Café da Manhã',
      time: '07:00',
      emoji: '☕',
      substitution: '2 fatias tapioca + 1 fatia queijo branco + 1 fruta + 200g iogurte desnatado',
      items: [
        { id: 'i1-1', name: 'Ovos mexidos com azeite', quantity: '3 unidades', calories: 220, protein: 19, carbs: 1, fat: 15 },
        { id: 'i1-2', name: 'Pão integral', quantity: '2 fatias (70g)', calories: 160, protein: 6, carbs: 28, fat: 2 },
        { id: 'i1-3', name: 'Abacate', quantity: '80g', calories: 120, protein: 1, carbs: 6, fat: 11 },
        { id: 'i1-4', name: 'Café preto sem açúcar', quantity: '200ml', calories: 5, protein: 0, carbs: 1, fat: 0 },
      ],
    },
    {
      id: 'meal-2',
      name: 'Lanche da Manhã',
      time: '10:00',
      emoji: '🍎',
      substitution: '1 fruta + 10 castanhas-do-pará',
      items: [
        { id: 'i2-1', name: 'Iogurte grego natural integral', quantity: '200g', calories: 130, protein: 17, carbs: 8, fat: 3 },
        { id: 'i2-2', name: 'Granola artesanal sem açúcar', quantity: '30g', calories: 110, protein: 3, carbs: 18, fat: 3 },
        { id: 'i2-3', name: 'Morangos frescos', quantity: '100g', calories: 32, protein: 1, carbs: 8, fat: 0 },
        { id: 'i2-4', name: 'Mel puro', quantity: '1 col. chá (7g)', calories: 22, protein: 0, carbs: 6, fat: 0 },
      ],
    },
    {
      id: 'meal-3',
      name: 'Almoço',
      time: '12:30',
      emoji: '🍛',
      substitution: '150g filé de peixe grelhado + 100g batata-doce + legumes refogados à vontade',
      items: [
        { id: 'i3-1', name: 'Peito de frango grelhado', quantity: '150g', calories: 225, protein: 45, carbs: 0, fat: 4 },
        { id: 'i3-2', name: 'Arroz integral cozido', quantity: '100g', calories: 124, protein: 3, carbs: 26, fat: 1 },
        { id: 'i3-3', name: 'Feijão carioca cozido', quantity: '1 concha (80g)', calories: 86, protein: 5, carbs: 15, fat: 0 },
        { id: 'i3-4', name: 'Salada verde variada', quantity: 'à vontade', calories: 25, protein: 2, carbs: 5, fat: 0 },
        { id: 'i3-5', name: 'Azeite de oliva extra virgem', quantity: '1 col. chá (5ml)', calories: 45, protein: 0, carbs: 0, fat: 5 },
      ],
    },
    {
      id: 'meal-4',
      name: 'Lanche da Tarde',
      time: '15:30',
      emoji: '🍌',
      substitution: '200g iogurte grego + 1 fruta + 1 col. sopa granola sem açúcar',
      items: [
        { id: 'i4-1', name: 'Shake de whey protein', quantity: '1 scoop (30g) + 250ml água', calories: 120, protein: 24, carbs: 4, fat: 2 },
        { id: 'i4-2', name: 'Banana prata', quantity: '1 unidade (100g)', calories: 89, protein: 1, carbs: 23, fat: 0 },
        { id: 'i4-3', name: 'Pasta de amendoim integral', quantity: '1 col. sopa (15g)', calories: 95, protein: 4, carbs: 3, fat: 8 },
      ],
    },
    {
      id: 'meal-5',
      name: 'Jantar',
      time: '19:00',
      emoji: '🌙',
      substitution: '3 ovos mexidos com legumes + salada verde à vontade',
      items: [
        { id: 'i5-1', name: 'Filé de salmão grelhado', quantity: '150g', calories: 280, protein: 30, carbs: 0, fat: 17 },
        { id: 'i5-2', name: 'Batata-doce assada', quantity: '150g', calories: 130, protein: 2, carbs: 30, fat: 0 },
        { id: 'i5-3', name: 'Brócolis no vapor', quantity: '150g', calories: 50, protein: 4, carbs: 9, fat: 0 },
      ],
    },
    {
      id: 'meal-6',
      name: 'Ceia',
      time: '21:00',
      emoji: '🌛',
      substitution: '150g iogurte desnatado + 1 col. chá mel + canela a gosto',
      items: [
        { id: 'i6-1', name: 'Queijo cottage light', quantity: '150g', calories: 110, protein: 18, carbs: 5, fat: 2 },
        { id: 'i6-2', name: 'Castanha-do-pará', quantity: '2 unidades (10g)', calories: 66, protein: 1, carbs: 1, fat: 7 },
        { id: 'i6-3', name: 'Chá de camomila sem açúcar', quantity: '200ml', calories: 2, protein: 0, carbs: 0, fat: 0 },
      ],
    },
  ],
};
