import { useState, useEffect } from 'react';
import { Task } from '../types';
import { getTasksByUser, createTask, updateTask, deleteTask } from '../services';
import { useAuth } from '../hooks';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

type FilterStatus = 'all' | 'pending' | 'in-progress' | 'completed';

export function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as Task['status'],
    priority: 'medium' as Task['priority'],
    dueDate: '',
  });

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getTasksByUser(user.uid);
      setTasks(data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    filter === 'all' ? true : task.status === filter
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingTask?.id) {
        await updateTask(editingTask.id, formData);
      } else {
        await createTask({
          ...formData,
          userId: user.uid,
          createdBy: user.displayName || 'user',
          source: 'web',
        });
      }
      setIsModalOpen(false);
      setEditingTask(null);
      resetForm();
      loadTasks();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    try {
      await deleteTask(taskId);
      loadTasks();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    if (!task.id) return;
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await updateTask(task.id, { status: newStatus });
      loadTasks();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || '',
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
    });
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-success/20 text-success',
      medium: 'bg-warning/20 text-warning',
      high: 'bg-danger/20 text-danger',
    };
    return colors[priority] || colors.medium;
  };

  const filters: { label: string; value: FilterStatus }[] = [
    { label: 'Todas', value: 'all' },
    { label: 'Pendentes', value: 'pending' },
    { label: 'Em Andamento', value: 'in-progress' },
    { label: 'Concluídas', value: 'completed' },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Tarefas</h2>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nova Tarefa
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f.value
                ? 'bg-primary text-white'
                : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <p className="text-text-secondary text-center py-12">
              Nenhuma tarefa encontrada.
            </p>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-bg-secondary border border-bg-tertiary rounded-2xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-text-primary">{task.title}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority === 'low' && 'Baixa'}
                        {task.priority === 'medium' && 'Média'}
                        {task.priority === 'high' && 'Alta'}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm mb-3">{task.description}</p>
                    {task.dueDate && (
                      <p className="text-xs text-text-secondary">
                        Vencimento: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleToggleStatus(task)}
                      className={`p-2 rounded-lg transition-colors ${
                        task.status === 'completed'
                          ? 'bg-success/20 text-success hover:bg-success/30'
                          : 'bg-bg-tertiary text-text-secondary hover:text-success'
                      }`}
                      title={task.status === 'completed' ? 'Reabrir' : 'Concluir'}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-2 rounded-lg bg-bg-tertiary text-text-secondary hover:text-primary transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id!)}
                      className="p-2 rounded-lg bg-bg-tertiary text-text-secondary hover:text-danger transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-secondary border border-bg-tertiary rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-text-primary">
                {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-bg-tertiary border border-bg-tertiary rounded-xl text-text-primary focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-bg-tertiary border border-bg-tertiary rounded-xl text-text-primary focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                    className="w-full px-4 py-2 bg-bg-tertiary border border-bg-tertiary rounded-xl text-text-primary focus:outline-none focus:border-primary"
                  >
                    <option value="pending">Pendente</option>
                    <option value="in-progress">Em Andamento</option>
                    <option value="completed">Concluída</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Prioridade
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                    className="w-full px-4 py-2 bg-bg-tertiary border border-bg-tertiary rounded-xl text-text-primary focus:outline-none focus:border-primary"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 bg-bg-tertiary border border-bg-tertiary rounded-xl text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-bg-tertiary text-text-primary rounded-xl font-medium hover:bg-bg-tertiary/80 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}