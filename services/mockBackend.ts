import { User, Studio } from '../types';

// Simulation of a backend database using LocalStorage
const USERS_KEY = 'pm_users';
const STUDIOS_KEY = 'pm_studios';
const CURRENT_USER_KEY = 'pm_current_user';

export const mockBackend = {
  // Auth Logic
  register: async (name: string, email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency

    const usersStr = localStorage.getItem(USERS_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    if (users.find(u => u.email === email)) {
      throw new Error('Este e-mail já está cadastrado.');
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Create an empty studio entry for this user immediately
    const studiosStr = localStorage.getItem(STUDIOS_KEY);
    const studios: Studio[] = studiosStr ? JSON.parse(studiosStr) : [];
    
    const newStudio: Studio = {
        id: crypto.randomUUID(),
        ownerId: newUser.id,
        name: '',
        cnpj: '',
        address: '',
        phone: ''
    };
    studios.push(newStudio);
    localStorage.setItem(STUDIOS_KEY, JSON.stringify(studios));

    return newUser;
  },

  login: async (email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const usersStr = localStorage.getItem(USERS_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    const user = users.find(u => u.email === email);

    // In a real app, check password hash here. 
    // For demo, we just check if user exists.
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Studio Data Logic
  getStudio: async (userId: string): Promise<Studio> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const studiosStr = localStorage.getItem(STUDIOS_KEY);
    const studios: Studio[] = studiosStr ? JSON.parse(studiosStr) : [];
    
    const studio = studios.find(s => s.ownerId === userId);
    if (!studio) throw new Error("Studio data missing");
    return studio;
  },

  updateStudio: async (userId: string, data: Partial<Studio>): Promise<Studio> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const studiosStr = localStorage.getItem(STUDIOS_KEY);
    let studios: Studio[] = studiosStr ? JSON.parse(studiosStr) : [];

    const index = studios.findIndex(s => s.ownerId === userId);
    if (index === -1) throw new Error("Studio not found");

    studios[index] = { ...studios[index], ...data };
    localStorage.setItem(STUDIOS_KEY, JSON.stringify(studios));
    
    return studios[index];
  }
};