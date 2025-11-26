import React, { useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { User } from '../types';
import { Loader2 } from 'lucide-react';

interface AuthFormProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let user: User;
      if (isLogin) {
        user = await mockBackend.login(email, password);
      } else {
        if (!name) throw new Error("Nome é obrigatório.");
        user = await mockBackend.register(name, email, password);
      }
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {isLogin ? 'Bem-vindo de volta' : 'Criar Conta'}
          </h1>
          <p className="text-slate-500">
            {isLogin ? 'Acesse o painel do seu estúdio' : 'Comece a gerenciar seu estúdio hoje'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
              <input
                type="text"
                required={!isLogin}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                placeholder="Ex: Maria Silva"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="ml-2 text-teal-600 hover:text-teal-700 font-medium"
          >
            {isLogin ? 'Cadastre-se' : 'Faça Login'}
          </button>
        </div>
      </div>
    </div>
  );
};