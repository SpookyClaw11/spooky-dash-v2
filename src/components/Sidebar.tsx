import { LayoutDashboard, ClipboardList, MessageSquare, Mic, LogOut, Ghost } from 'lucide-react';
import { useAuth } from '../hooks';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tarefas', icon: ClipboardList },
  { id: 'interactions', label: 'Interações', icon: MessageSquare },
  { id: 'voice', label: 'Chat Voz', icon: Mic },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-bg-secondary border-r border-bg-tertiary h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-bg-tertiary">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
            <Ghost className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-text-primary">B&S</h1>
            <p className="text-xs text-text-secondary">Task Manager</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="p-4 border-t border-bg-tertiary">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-bg-tertiary rounded-full flex items-center justify-center">
            <span className="text-lg">👻</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-text-primary truncate">
              {user?.displayName || 'Usuário'}
            </p>
            <p className="text-xs text-text-secondary truncate">
              {user?.email || ''}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-4 py-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}