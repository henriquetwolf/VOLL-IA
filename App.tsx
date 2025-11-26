import React, { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { AuthForm } from './components/AuthForm';
import { StudioProfile } from './components/StudioProfile';
import { Assistant } from './components/Assistant';
import { mockBackend } from './services/mockBackend';
import { User, ViewState } from './types';
import { Activity, Users, TrendingUp } from 'lucide-react';

const DashboardHome = () => (
  <div className="space-y-6">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
      <p className="text-slate-500">Bem-vindo ao painel de controle do seu estúdio.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          <Users size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Alunos Ativos</p>
          <p className="text-2xl font-bold text-slate-800">0</p>
          <p className="text-xs text-slate-400 mt-1">Configure seu perfil para começar</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
          <Activity size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Aulas Hoje</p>
          <p className="text-2xl font-bold text-slate-800">0</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
          <TrendingUp size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">Faturamento (Mês)</p>
          <p className="text-2xl font-bold text-slate-800">R$ 0,00</p>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-xl p-8 text-white">
      <h3 className="text-xl font-bold mb-2">Configure seu Estúdio</h3>
      <p className="mb-4 text-teal-100 max-w-lg">
        Complete o cadastro com CNPJ, Endereço e Telefone para liberar todas as funcionalidades de gestão.
      </p>
    </div>
  </div>
);

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Check for existing session
    const currentUser = mockBackend.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setInitializing(false);
  }, []);

  const handleLogout = () => {
    mockBackend.logout();
    setUser(null);
    setView(ViewState.DASHBOARD);
  };

  if (initializing) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-teal-600">Carregando...</div>;
  }

  if (!user) {
    return <AuthForm onLoginSuccess={setUser} />;
  }

  return (
    <Layout 
      user={user} 
      currentView={view} 
      onNavigate={setView}
      onLogout={handleLogout}
    >
      {view === ViewState.DASHBOARD && <DashboardHome />}
      {view === ViewState.PROFILE && <StudioProfile user={user} />}
      {view === ViewState.AI_ASSISTANT && <Assistant user={user} />}
    </Layout>
  );
}

export default App;