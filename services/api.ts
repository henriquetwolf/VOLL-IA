import { User, Studio } from '../types';
import { supabase } from './supabaseClient';

// Helper para converter usuário do Supabase para o tipo do App
const mapSupabaseUser = (sbUser: any): User => {
  return {
    id: sbUser.id,
    email: sbUser.email || '',
    name: sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Usuário',
  };
};

export const api = {
  // --- Autenticação ---

  register: async (name: string, email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // Salva o nome nos metadados do usuário
      },
    });

    if (error) throw new Error(error.message);
    
    // Sucesso no cadastro. Se a confirmação de e-mail estiver desligada,
    // o usuário já estará logado.
    if (!data.user) throw new Error("Erro ao criar usuário.");

    return mapSupabaseUser(data.user);
  },

  login: async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error("E-mail ou senha incorretos.");
    if (!data.user) throw new Error("Usuário não encontrado.");

    return mapSupabaseUser(data.user);
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  getCurrentSession: async (): Promise<User | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user ? mapSupabaseUser(session.user) : null;
  },

  // --- Dados do Estúdio (Banco de Dados) ---

  getStudio: async (userId: string): Promise<Studio> => {
    // 1. Tenta buscar o estúdio existente no banco
    const { data, error } = await supabase
      .from('studios')
      .select('*')
      .eq('owner_id', userId)
      .maybeSingle(); // maybeSingle não joga erro se não encontrar (retorna null)

    if (error) {
      console.error("Erro Supabase:", error);
      throw new Error("Erro de conexão ao buscar estúdio.");
    }

    // 2. Se encontrou, retorna os dados
    if (data) {
      return {
        id: data.id,
        ownerId: data.owner_id,
        name: data.name || '',
        cnpj: data.cnpj || '',
        address: data.address || '',
        phone: data.phone || ''
      };
    }

    // 3. Se NÃO encontrou, precisamos criar um novo (Lazy Creation).
    // Antes de inserir, verificamos se a sessão está ativa para não violar o RLS.
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error("Sessão não detectada. Tente fazer login novamente.");
    }

    const { data: newData, error: createError } = await supabase
      .from('studios')
      .insert([{ 
        owner_id: userId, 
        name: '', 
        cnpj: '', 
        address: '', 
        phone: '' 
      }])
      .select()
      .single();
      
    if (createError) {
      console.error("Erro ao criar estúdio:", createError);
      throw new Error("Falha ao inicializar o registro do estúdio. Tente recarregar a página.");
    }

    return {
      id: newData.id,
      ownerId: newData.owner_id,
      name: newData.name || '',
      cnpj: newData.cnpj || '',
      address: newData.address || '',
      phone: newData.phone || ''
    };
  },

  updateStudio: async (userId: string, studioData: Partial<Studio>): Promise<Studio> => {
    // Prepara o objeto payload apenas com campos definidos
    const dbPayload: any = {};
    if (studioData.name !== undefined) dbPayload.name = studioData.name;
    if (studioData.cnpj !== undefined) dbPayload.cnpj = studioData.cnpj;
    if (studioData.address !== undefined) dbPayload.address = studioData.address;
    if (studioData.phone !== undefined) dbPayload.phone = studioData.phone;

    // Atualiza onde o owner_id for igual ao usuário logado
    const { data, error } = await supabase
      .from('studios')
      .update(dbPayload)
      .eq('owner_id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      ownerId: data.owner_id,
      name: data.name || '',
      cnpj: data.cnpj || '',
      address: data.address || '',
      phone: data.phone || ''
    };
  }
};