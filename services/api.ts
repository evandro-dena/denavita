/**
 * services/api.ts
 * Camada de serviços da DenaVita — V1 (dados mockados)
 *
 * Estrutura preparada para integração com backend na V2.
 * Substitua cada método pelo fetch/axios real quando a API estiver pronta.
 */

import { mockMealPlan } from '@/mocks/mealPlanData';
import { mockUser } from '@/mocks/userData';
import { mockRecipes } from '@/mocks/recipesData';
import type { DietPlan, Recipe } from '@/types';

// ─── Tipos de payload / resposta ─────────────────────────────────────────────

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  name: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface UpdateWeightPayload {
  userId: string;
  weight: number;
  date: string;
}

export interface ScanResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number; // 0-1
}

export interface FeedbackPayload {
  stars: number;        // 1–5
  message: string;
  userId?: string;
  appVersion?: string;
}

// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Autentica o usuário com email e senha.
   * V1: aceita qualquer credencial e retorna dados mockados.
   * TODO: conectar API — POST /auth/login
   */
  async login(_credentials: AuthCredentials): Promise<AuthResponse> {
    // TODO: conectar API — substituir por:
    // const res = await fetch(`${API_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(_credentials),
    // });
    // return res.json();

    return {
      token: 'mock-token-v1',
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        avatar: null,
      },
    };
  },

  /**
   * Encerra a sessão do usuário.
   * TODO: conectar API — POST /auth/logout
   */
  async logout(): Promise<void> {
    // TODO: conectar API — limpar token do SecureStore
  },

  /**
   * Registra um novo usuário.
   * TODO: conectar API — POST /auth/register
   */
  async register(_data: RegisterData): Promise<AuthResponse> {
    // TODO: conectar API
    throw new Error('authService.register: não disponível na V1');
  },

  /**
   * Solicita redefinição de senha por email.
   * TODO: conectar API — POST /auth/forgot-password
   */
  async forgotPassword(_email: string): Promise<void> {
    // TODO: conectar API
  },
};

// ─── Meal Plan Service ────────────────────────────────────────────────────────

export const mealPlanService = {
  /**
   * Busca o plano alimentar do usuário.
   * V1: retorna dados mockados.
   * TODO: conectar API — GET /meal-plan/:userId
   */
  async getMealPlan(_userId: string): Promise<DietPlan> {
    // TODO: conectar API — substituir por:
    // const res = await fetch(`${API_URL}/meal-plan/${_userId}`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // return res.json();

    return mockMealPlan;
  },

  /**
   * Atualiza o peso atual do usuário.
   * V1: apenas resolve sem persistência.
   * TODO: conectar API — PATCH /users/:userId/weight
   */
  async updateWeight(_payload: UpdateWeightPayload): Promise<void> {
    // TODO: conectar API — persistir no backend e atualizar gráfico de evolução
  },

  /**
   * Busca o histórico de peso do usuário.
   * TODO: conectar API — GET /users/:userId/weight-history
   */
  async getWeightHistory(_userId: string): Promise<void> {
    // TODO: conectar API
  },
};

// ─── Recipe Service ───────────────────────────────────────────────────────────

export const recipeService = {
  /**
   * Lista receitas, opcionalmente filtradas por categoria.
   * V1: retorna dados mockados.
   * TODO: conectar API — GET /recipes?category=...&q=...
   */
  async getRecipes(_category?: string, _query?: string): Promise<Recipe[]> {
    // TODO: conectar API — buscar do CMS (Contentful, Sanity, Strapi)
    return mockRecipes;
  },

  /**
   * Busca uma receita pelo ID.
   * V1: busca no array mockado.
   * TODO: conectar API — GET /recipes/:id
   */
  async getRecipeById(id: string): Promise<Recipe | null> {
    // TODO: conectar API
    return mockRecipes.find((r) => r.id === id) ?? null;
  },

  /**
   * Salva/remove uma receita dos favoritos do usuário.
   * TODO: conectar API — POST /recipes/:id/favorite
   */
  async toggleFavorite(_recipeId: string, _userId: string): Promise<boolean> {
    // TODO: conectar API
    return true;
  },
};

// ─── Scan Service ─────────────────────────────────────────────────────────────

export const scanService = {
  /**
   * Analisa uma imagem de alimento e retorna estimativa nutricional.
   * V1: retorna resultado mockado.
   *
   * TODO: conectar API — POST /scan/analyze (multipart/form-data)
   * Opções de integração recomendadas para V2:
   *   - Nutritionix Track API (reconhecimento por texto + imagem)
   *   - Clarifai Food Model (reconhecimento visual)
   *   - OpenAI GPT-4 Vision (análise multimodal)
   *   - Edamam Food Database API
   */
  async analyzeFood(_imageUri: string): Promise<ScanResult> {
    // TODO: conectar API — substituir por chamada real de visão computacional
    await new Promise((r) => setTimeout(r, 1500)); // simula latência V1

    return {
      name: 'Salada Caesar com Frango',
      calories: 320,
      protein: 28,
      carbs: 15,
      fat: 18,
      confidence: 0.87,
    };
  },
};

// ─── Feedback Service ─────────────────────────────────────────────────────────

export const feedbackService = {
  /**
   * Envia feedback do usuário.
   * V1: apenas loga no console.
   *
   * TODO: conectar API — POST /feedback
   * Opções de integração para V2:
   *   - Gmail API (envio direto para e-mail do suporte)
   *   - SendGrid / Resend (transacional)
   *   - Notion API (banco de feedbacks)
   */
  async sendFeedback(payload: FeedbackPayload): Promise<void> {
    // TODO: conectar API
    console.log('[feedbackService] Feedback recebido:', payload);
  },
};
