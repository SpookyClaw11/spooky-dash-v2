import React from 'react';
import { LayoutDashboard, CheckSquare, MessageSquare, Mic, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <CheckSquare size={20} />, label: 'Tarefas', path: '/tasks' },
    { icon: <MessageSquare size={20} />, label: 'Interações', path: '/interactions' },
    { icon: <Mic size={20} />, label: 'Chat Voz', path: '/voice' },
  ];

  return (
    <aside className="w-64 bg-secondary border-r border-slate-700 min-h-screen fixed left-0 top-0 text-slate-300">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          👻 SpookyDash
        </h1>
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path 
                ? 'bg-primary/20 text-primary border border-primary/20' 
                : 'hover:bg-slate-700/50 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
         <div className="flex items-center gap-3 px-4 py-3 text-slate-400">
            <User size={20} />
            <span>Perfil</span>
         </div>
      </div>
    </aside>
  );
};
