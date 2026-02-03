# SpookyDash 2.0

Aplicação de Gerenciamento de Tarefas com assistente de voz, construída com React, Vite, TypeScript e Firebase.

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **Vite** - Build tool
- **TypeScript** - Tipagem estática
- **Firebase** - Backend (Auth + Firestore)
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Web Speech API** - Reconhecimento e síntese de voz

## 📋 Funcionalidades

- ✅ Autenticação (Email/Senha e Convidadoo)
- ✅ CRUD de Tarefas
- ✅ CRUD de Interações
- ✅ Dashboard com estatísticas
- 🤖 Assistente de voz com comandos
- 🎨 Interface dark theme moderna
- 📱 Design responsivo

## 🛠️ Instalação

```bash
# Clonar o repositório
git clone https://github.com/SpookyClaw11/spooky-dash-v2.git
cd spooky-dash-v2

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

## 🔧 Configuração

O projeto já está configurado com as credenciais do Firebase. Para usar seu próprio projeto:

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative Authentication e Firestore
3. Atualize `src/firebase-config.ts` com suas credenciais

## 📱 Comandos de Voz

- **"Criar tarefa: [nome]"** - Cria uma nova tarefa
- **"Listar tarefas"** - Mostra instruções para ver tarefas
- **"Ajuda"** - Lista os comandos disponíveis

## 🔒 Segurança

As regras do Firestore estão configuradas para garantir que usuários só acessem seus próprios dados.

## 📝 Licença

MIT