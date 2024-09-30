export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface RetroCard {
  id?: number;
  type: string;
  content: string;
  isAnonymous: boolean;
  author: string;
  likes: string;
  createdAt: string;
}

export interface ActionItem {
  id?: number;
  assignee: string;
  dueDate: string;
  content: string;
}
