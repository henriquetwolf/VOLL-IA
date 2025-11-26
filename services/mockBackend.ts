import { User, Studio } from '../types';
import { supabase } from './supabaseClient';

// Helper to map Supabase User to App User
const mapSupabaseUser = (sbUser: any): User => {
  return {
    id: sbUser.id,
    email: sbUser.email || '',
    name: sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Usuário',
  };
};

export const mockBackend = {
  // Auth Logic
  register: async (name: string, email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // Save name in user_metadata
      },
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("Erro ao criar usuário.");

    // Create the studio entry immediately linked to this user
    const { error: studioError } = await supabase
      .from('studios')
      .insert([
        { 
          owner_id: data.user.id,
          name: '',
          cnpj: '',
          address: '',
          phone: ''
        }
      ]);

    if (studioError) {
      console.error("Error creating studio record:", studioError);
      // We don't throw here to allow login, studio can be created later if missing
    }

    return mapSupabaseUser(data.user);
  },

  login: async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("Usuário não encontrado.");

    return mapSupabaseUser(data.user);
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  // Note: This replaces the sync getCurrentUser with an async fetch or session check
  // The App component will now listen to auth state changes directly, but this helper is useful
  getCurrentSession: async (): Promise<User | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user ? mapSupabaseUser(session.user) : null;
  },

  // Studio Data Logic
  getStudio: async (userId: string): Promise<Studio> => {
    // Note: 'userId' is passed but we should rely on RLS (Row Level Security) using the auth session
    const { data, error } = await supabase
      .from('studios')
      .select('*')
      .eq('owner_id', userId)
      .single();

    if (error) {
      // If no studio exists (legacy user or error), return a placeholder or create one
      if (error.code === 'PGRST116') { // code for no rows found
         // Auto-create if missing
         const { data: newData, error: createError } = await supabase
            .from('studios')
            .insert([{ owner_id: userId, name: '', cnpj: '', address: '', phone: '' }])
            .select()
            .single();
            
         if (!createError && newData) {
             return {
                 id: newData.id,
                 ownerId: newData.owner_id,
                 name: newData.name || '',
                 cnpj: newData.cnpj || '',
                 address: newData.address || '',
                 phone: newData.phone || ''
             };
         }
      }
      throw new Error(error.message);
    }

    // Map DB snake_case to TS camelCase
    return {
      id: data.id,
      ownerId: data.owner_id,
      name: data.name || '',
      cnpj: data.cnpj || '',
      address: data.address || '',
      phone: data.phone || ''
    };
  },

  updateStudio: async (userId: string, studioData: Partial<Studio>): Promise<Studio> => {
    // Map TS camelCase to DB snake_case for update
    const dbPayload: any = {};
    if (studioData.name !== undefined) dbPayload.name = studioData.name;
    if (studioData.cnpj !== undefined) dbPayload.cnpj = studioData.cnpj;
    if (studioData.address !== undefined) dbPayload.address = studioData.address;
    if (studioData.phone !== undefined) dbPayload.phone = studioData.phone;

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