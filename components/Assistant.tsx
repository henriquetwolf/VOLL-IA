import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User as UserIcon, Sparkles } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { ChatMessage, Studio, User } from '../types';
import { mockBackend } from '../services/mockBackend';

interface AssistantProps {
  user: User;
}

export const Assistant: React.FC<AssistantProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: `Olá, ${user.name}! Sou seu assistente virtual especializado em gestão de Pilates. Posso ajudar com dicas de marketing, retenção de alunos ou organização do estúdio. Como posso ajudar hoje?`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [studio, setStudio] = useState<Studio | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load studio context for better AI answers
    mockBackend.getStudio(user.id).then(setStudio).catch(() => {});
  }, [user.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    
    // Add User Message
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', text: userText, timestamp: Date.now() }
    ];
    setMessages(newMessages);
    setIsLoading(true);

    // Call Gemini
    const aiResponseText = await getGeminiResponse(userText, studio);

    // Add AI Message
    setMessages(prev => [
      ...prev,
      { role: 'model', text: aiResponseText, timestamp: Date.now() }
    ]);
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] flex flex-col">
       <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="text-amber-500" />
          Consultor Inteligente
        </h2>
        <p className="text-slate-500">Tire dúvidas sobre gestão e receba dicas personalizadas.</p>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-teal-600 text-white' : 'bg-indigo-600 text-white'
              }`}>
                {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-teal-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-sm ml-12">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre gestão, marketing ou dicas..."
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white p-3 rounded-xl transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};