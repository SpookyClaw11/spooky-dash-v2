export interface Task {
  id?: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  userId: string;
  dueDate?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  source?: string;
}

export interface Interaction {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}