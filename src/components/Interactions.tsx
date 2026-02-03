import { useState, useEffect } from 'react';
import { Interaction } from '../types';
import { getInteractionsByUser, createInteraction, updateInteraction, deleteInteraction } from '../services';
import { useAuth } from '../hooks';
import { Plus, Edit2, Trash2, XCircle, Loader2, Tag } from 'lucide-react';

export function Interactions() {
  const { user } = useAuth();
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
  });

  useEffect(() => {
    if (user) {
      loadInteractions();
    }
  }, [user]);

  const loadInteractions = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getInteractionsByUser(user.uid);
      setInteractions(data);
    } catch (error) {
      console.error('Erro ao carregar interações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

    try {
      if (editingInteraction?.id) {
        await updateInteraction(editingInteraction.id, { ...formData, tags });
      } else {
        await createInteraction({
          ...formData,
          tags,
          userId: user.uid,
        });
      }
      setIsModalOpen(false);
      setEditingInteraction(null);
      resetForm();
      loadInteractions();
    } catch (error) {
      console.error('Erro ao salvar interação:', error);
    }
  };

  const handleDelete = async (interactionId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta interação?')) return;
    try {
      await deleteInteraction(interactionId);
      loadInteractions();
    } catch (error) {
      console.error('Erro ao excluir interação:', error);
    }
  };

  const openEditModal = (interaction: Interaction) => {
    setEditingInteraction(interaction);
    setFormData({
      title: interaction.title,
      description: interaction.description,
      tags: interaction.tags.join(', '),
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingInteraction(null);
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      tags: '',
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Interações</h2>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nova Interação
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {interactions.length === 0 ? (
            <p className="text-text-secondary text-center py-12">
              Nenhuma interação encontrada.
            </p>
          ) : (
            interactions.map((interaction) => (
              <div
                key={interaction.id}
                className="bg-bg-secondary border border-bg-tertiary rounded-2xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary mb-2">{interaction.title}</h3>
                    <p className="text-text-secondary text-sm mb-3">{interaction.description}</p>
                    {interaction.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="w-4 h-4 text-text-secondary" />
                        {interaction.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-bg-tertiary text-text-secondary text-xs rounded-lg"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(interaction)}
                      className="p-2 rounded-lg bg-bg-tertiary text-text-secondary hover:text-primary transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(interaction.id!)}
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
                {editingInteraction ? 'Editar Interação' : 'Nova Interação'}
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
                  rows={4}
                  className="w-full px-4 py-2 bg-bg-tertiary border border-bg-tertiary rounded-xl text-text-primary focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="ex: importante, urgente, trabalho"
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