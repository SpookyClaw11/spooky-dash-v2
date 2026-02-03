import { useState } from 'react';
import { useAuth } from '../hooks';
import { Ghost, Eye, EyeOff, Loader2 } from 'lucide-react';

export function Login() {
  const { login, register, loginAsGuest } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        await register(formData.email, formData.password, formData.name);
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao autenticar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg-primary">
      <div className="w-full max-w-md bg-bg-secondary border border-bg-tertiary rounded-3xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
            <Ghost className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">B&S Task Manager</h1>
          <p className="text-text-secondary">Organize suas tarefas com estilo</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Nome
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-bg-tertiary border border-bg-tertiary rounded-xl text-text-primary focus:outline-none focus:border-primary"
                placeholder="Seu nome"
                required={isRegistering}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-bg-tertiary border border-bg-tertiary rounded-xl text-text-primary focus:outline-none focus:border-primary"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-bg-tertiary border border-bg-tertiary rounded-xl text-text-primary focus:outline-none focus:border-primary pr-12"
                placeholder="••••••••"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {isRegistering && (
              <p className="text-xs text-text-secondary mt-1">Mínimo 6 caracteres</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isRegistering ? 'Criar Conta' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-bg-tertiary"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-bg-secondary text-text-secondary">ou</span>
            </div>
          </div>

          <button
            onClick={handleGuestLogin}
            className="w-full mt-4 py-3 bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary rounded-xl font-semibold transition-colors"
          >
            Entrar como Convidado
          </button>
        </div>

        <p className="mt-6 text-center text-text-secondary text-sm">
          {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-primary hover:text-primary-dark font-medium transition-colors"
          >
            {isRegistering ? 'Entrar' : 'Criar conta'}
          </button>
        </p>
      </div>
    </div>
  );
}