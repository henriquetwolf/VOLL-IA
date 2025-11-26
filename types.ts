export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Studio {
  id: string;
  ownerId: string;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  PROFILE = 'PROFILE',
  AI_ASSISTANT = 'AI_ASSISTANT'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}