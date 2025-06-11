// Configuração para produção e desenvolvimento
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5001',
    APP_NAME: 'Sistema de Rotina com Recompensas',
    VERSION: '1.0.0'
  },
  production: {
    // URL será definida após deploy do backend
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://seu-backend.railway.app',
    APP_NAME: 'Sistema de Rotina com Recompensas',
    VERSION: '1.0.0'
  }
};

// Detecta o ambiente
const environment = process.env.NODE_ENV || 'development';

// Exporta a configuração atual
export default config[environment];

// Configurações específicas
export const API_ENDPOINTS = {
  DASHBOARD: '/api/dashboard',
  TASKS_TODAY: '/api/tasks/today',
  TASKS: '/api/tasks',
  REWARDS_BALANCE: '/api/rewards/balance',
  COMPLETE_TASK: (id) => `/api/tasks/${id}/complete`,
  SKIP_TASK: (id) => `/api/tasks/${id}/skip`,
  DELETE_TASK: (id) => `/api/tasks/${id}`,
  SETTINGS: '/api/settings'
};

// Configurações da aplicação
export const APP_CONFIG = {
  TV_MODE_REFRESH_INTERVAL: 15000, // 15 segundos
  DASHBOARD_REFRESH_INTERVAL: 30000, // 30 segundos
  MAX_COINS_PER_TASK: 10,
  DEFAULT_TIMEZONE: 'America/Sao_Paulo',
  CATEGORIES: {
    hygiene: { icon: '🧼', name: 'Higiene', color: 'pink' },
    food: { icon: '🍽️', name: 'Alimentação', color: 'orange' },
    study: { icon: '📚', name: 'Estudos', color: 'blue' },
    exercise: { icon: '🏃', name: 'Exercícios', color: 'green' },
    chores: { icon: '🧹', name: 'Tarefas Domésticas', color: 'yellow' },
    leisure: { icon: '🎮', name: 'Lazer', color: 'purple' },
    other: { icon: '📝', name: 'Outros', color: 'gray' }
  }
};

