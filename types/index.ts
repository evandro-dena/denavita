export interface User {
  id: string;
  name: string;
  startWeight: number;
  currentWeight: number;
  goalWeight: number;
  lastWeightDate: string;
}

export interface WeightRecord {
  date: string;
  weight: number;
  week: string;
}

export interface BioimpedanceRecord {
  date: string;
  bodyFatPercentage: number;
  leanMass: number;
  fatMass: number;
  bodyWater: number;
  metabolicRate: number;
  bmi: number;
}

export interface MealItem {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  emoji: string;
  items: MealItem[];
  substitution?: string;
}

export type RecipeCategory = 'Todas' | 'Sobremesas' | 'Salgadas' | 'Almoço' | 'Lanches' | 'Café';
export type Difficulty = 'Fácil' | 'Médio' | 'Difícil';

export interface RecipeIngredient {
  id: string;
  text: string;
}

export interface Recipe {
  id: string;
  name: string;
  category: RecipeCategory;
  emoji: string;
  color: string;       // fallback background color when no image
  coverImage?: number; // require() local asset
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;        // e.g. "10 min"
  servings: number;
  difficulty: Difficulty;
  ingredients: RecipeIngredient[];
  steps: string[];
}

export interface DietPlan {
  id: string;
  userId: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: Meal[];
}
