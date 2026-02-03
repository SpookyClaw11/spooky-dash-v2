import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { useAuth, useVoice } from '../hooks';
import { Send, Mic, MicOff, Loader2 } from 'lucide-react';
import { createTask, createInteraction } from '../services';

export function VoiceChat() {
  const { user } = useAuth();
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    speak,
    isSpeaking,
    supported,
    error,
  } = useVoice();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: 'Olá! Eu sou o assistente Spooky. Posso ajudar você a criar tarefas, listar suas atividades ou apenas conversar. Como posso ajudar?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Processar transcrição quando parar de ouvir
  useEffect(() => {
    if (!isListening && transcript.trim()) {
      const text = transcript.trim();
      resetTranscript();
      handleUserMessage(text);
    }
  }, [isListening, transcript]);

  const handleUserMessage = async (text: string) => {
    if (!text.trim() || !user) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const response = await processCommand(text);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      speak(response);
    } catch (error) {
      console.error('Erro ao processar comando:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const processCommand = async (text: string): Promise<string> => {
    const lowerText = text.toLowerCase();

    // Comando: Criar tarefa
    if (lowerText.includes('criar tarefa') || lowerText.includes('nova tarefa')) {
      const taskTitle = text.replace(/criar tarefa:?|nova tarefa:?/i, '').trim();
      if (taskTitle) {
        try {
          await createTask({
            title: taskTitle,
            description: 'Criada via assistente de voz',
            status: 'pending',
            priority: 'medium',
            userId: user!.uid,
            createdBy: 'spooky',
            source: 'voice',
          });
          return `Tarefa "${taskTitle}" criada com sucesso!`;
        } catch (error) {
          return 'Desculpe, não consegui criar a tarefa. Tente novamente.';
        }
      }
      return 'Qual é o nome da tarefa que você quer criar?';
    }

    // Comando: Listar tarefas
    if (lowerText.includes('listar') || lowerText.includes('mostrar tarefas')) {
      return 'Acesse a aba "Tarefas" no menu lateral para ver todas as suas tarefas.';
    }

    // Comando: Ajuda
    if (lowerText.includes('ajuda') || lowerText.includes('help')) {
      return 'Aqui estão os comandos que você pode usar:\n\n• "Criar tarefa: [nome]" - Cria uma nova tarefa\n• "Listar tarefas" - Mostra como ver suas tarefas\n• "Ajuda" - Mostra esta mensagem\n\nOu simplesmente converse comigo!';
    }

    // Saudações
    if (lowerText.includes('olá') || lowerText.includes('oi') || lowerText.includes('ola')) {
      return 'Olá! Como posso ajudar você hoje?';
    }

    // Salvar como interação
    try {
      await createInteraction({
        title: 'Chat de Voz',
        description: text,
        tags: ['voice-chat'],
        userId: user!.uid,
      });
    } catch (error) {
      console.error('Erro ao salvar interação:', error);
    }

    return 'Entendi! Suas palavras foram registradas como uma interação. Posso ajudar com mais alguma coisa?';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleUserMessage(inputText);
      setInputText('');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!supported) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Chat por Voz</h2>
        <div className="bg-bg-secondary border border-bg-tertiary rounded-2xl p-8 text-center">
          <MicOff className="w-16 h-16 text-danger mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Reconhecimento de voz não suportado
          </h3>
          <p className="text-text-secondary">
            {error || 'Seu navegador não suporta reconhecimento de voz. Use Chrome ou Edge.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 h-[calc(100vh-4rem)] flex flex-col">
      <h2 className="text-2xl font-bold text-text-primary mb-6">Chat por Voz</h2>

      {/* Chat Messages */}
      <div className="flex-1 bg-bg-secondary border border-bg-tertiary rounded-2xl p-6 overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-bg-tertiary text-text-primary rounded-bl-md'
                }`}
              >
                <p className="whitespace-pre-line">{message.text}</p>
                <span
                  className={`text-xs mt-2 block ${
                    message.sender === 'user' ? 'text-white/70' : 'text-text-secondary'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-bg-tertiary text-text-primary rounded-2xl rounded-bl-md p-4">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-bg-secondary border border-bg-tertiary rounded-2xl p-4">
        {isListening && (
          <div className="mb-3 text-center">
            <span className="text-primary font-medium animate-pulse">Ouvindo...</span>
            {interimTranscript && (
              <p className="text-text-secondary text-sm mt-1">{interimTranscript}</p>
            )}
          </div>
        )}

        {isSpeaking && (
          <div className="mb-3 text-center">
            <span className="text-success font-medium">Falando...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleListening}
            disabled={isSpeaking}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isListening
                ? 'bg-danger text-white animate-pulse'
                : 'bg-bg-tertiary text-text-secondary hover:text-primary'
            } ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={isListening || isSpeaking}
            className="flex-1 px-4 py-3 bg-bg-tertiary border border-bg-tertiary rounded-xl text-text-primary focus:outline-none focus:border-primary disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isListening || isSpeaking}
            className="p-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
}