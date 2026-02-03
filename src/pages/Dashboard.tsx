import React, { useEffect } from 'react';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { CheckCircle, Clock, AlertCircle, Mic } from 'lucide-react';
import { useVoice } from '../hooks/useVoice';

export const Dashboard: React.FC = () => {
  const { isListening, transcript, startListening, speak } = useVoice();

  useEffect(() => {
    if (transcript) {
      if (transcript.toLowerCase().includes('olá')) {
        speak('Olá! Eu sou o Spooky, seu assistente.');
      }
    }
  }, [transcript, speak]);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <div className="flex items-center gap-4">
           {isListening && <span className="text-primary animate-pulse">Ouvindo...</span>}
           <button 
             onClick={startListening}
             className={`p-3 rounded-full transition-all ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
           >
             <Mic className="text-white" />
           </button>
        </div>
      </header>
      
      {transcript && (
        <div className="bg-surface border border-slate-700 p-4 rounded-lg">
           <p className="text-slate-400 text-sm">Último comando:</p>
           <p className="text-xl text-white">"{transcript}"</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Tarefas Totais" 
          value={12} 
          icon={<CheckCircle className="text-blue-500" />} 
          color="bg-blue-500"
        />
        <StatsCard 
          title="Pendentes" 
          value={5} 
          icon={<Clock className="text-amber-500" />} 
          color="bg-amber-500"
        />
        <StatsCard 
          title="Em Andamento" 
          value={3} 
          icon={<AlertCircle className="text-purple-500" />} 
          color="bg-purple-500"
        />
        <StatsCard 
          title="Concluídas" 
          value={4} 
          icon={<CheckCircle className="text-green-500" />} 
          color="bg-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Tarefas Recentes</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-slate-200">Atualizar documentação do projeto</span>
                </div>
                <span className="text-xs text-slate-500">Hoje</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-surface border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Atividade do Sistema</h3>
          <div className="space-y-4">
             <div className="text-slate-400 text-sm">Nenhuma atividade recente encontrada.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
