import React, { useState } from 'react';
import { User, ViewState } from '../types';
import { 
  Menu, 
  X, 
  LogOut, 
  UserCircle, 
  LayoutDashboard, 
  Bot 
} from 'lucide-react';

interface LayoutProps {
  user: User;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  user, 
  currentView, 
  onNavigate, 
  onLogout, 
  children 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => {
        onNavigate(view);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        currentView === view 
          ? 'bg-teal-50 text-teal-700 font-medium' 
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h1 className="text-xl font-bold text-teal-600 flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white">
                P
              </div>
              Pilates Mgr
            </h1>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Visão Geral" />
            <NavItem view={ViewState.PROFILE} icon={UserCircle} label="Meu Estúdio" />
            <NavItem view={ViewState.AI_ASSISTANT} icon={Bot} label="Consultor IA" />
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="mb-4 px-4">
              <p className="text-xs text-slate-400 uppercase font-semibold">Logado como</p>
              <p className="text-sm font-medium text-slate-700 truncate">{user.name}</p>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <h1 className="font-bold text-teal-600">Pilates Mgr</h1>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-md"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};