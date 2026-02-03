import { useState, useEffect } from 'react';
import { Task, TaskStats } from '../types';
import { getRecentTasks, getTasksByUser } from '../services';
import { useAuth } from '../hooks';
import { Clock, CheckCircle2, Loader2, ListTodo } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [tasks, recent] = await Promise.all([
        getTasksByUser(user.uid),
        getRecentTasks(user.uid, 5),
      ]);

      const stats: TaskStats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
      };

      setStats(stats);
      setRecentTasks(recent);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Pendentes', value: stats.pending, icon: Clock, color: 'warning' },
    { label: 'Em Andamento', value: stats.inProgress, icon: Loader2, color: 'info' },
    { label: 'Concluídas', value: stats.completed, icon: CheckCircle2, color: 'success' },
    { label: 'Total', value: stats.total, icon: ListTodo, color: 'primary' },
  ];

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      warning: 'bg-warning/10 text-warning border-warning/20',
      info: 'bg-info/10 text-info border-info/20',
      success: 'bg-success/10 text-success border-success/20',
      primary: 'bg-primary/10 text-primary border-primary/20',
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-text-primary mb-6">Dashboard</h2>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="bg-bg-secondary border border-bg-tertiary rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getColorClass(card.color)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-bold text-text-primary">{card.value}</span>
                  </div>
                  <p className="text-text-secondary font-medium">{card.label}</p>
                </div>
              );
            })}
          </div>

          {/* Recent Tasks */}
          <div className="bg-bg-secondary border border-bg-tertiary rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Tarefas Recentes</h3>
            {recentTasks.length === 0 ? (
              <p className="text-text-secondary">Nenhuma tarefa encontrada.</p>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-bg-tertiary/50 rounded-xl"
                  >
                    <div>
                      <h4 className="font-medium text-text-primary">{task.title}</h4>
                      <p className="text-sm text-text-secondary mt-1">{task.description}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === 'completed'
                          ? 'bg-success/20 text-success'
                          : task.status === 'in-progress'
                          ? 'bg-info/20 text-info'
                          : 'bg-warning/20 text-warning'
                      }`}
                    >
                      {task.status === 'pending' && 'Pendente'}
                      {task.status === 'in-progress' && 'Em Andamento'}
                      {task.status === 'completed' && 'Concluída'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}