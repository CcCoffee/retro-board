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
  likes: User[]; // 修改这里
  createdAt: string;
  author?: User; // 修改这里
}

export interface ActionItem {
  id?: number;
  assignee: User;
  dueDate: string;
  content: string;
  createdAt: string;
}

export interface RetroBoardHistory {
  id: number;
  cards: RetroCard[];
  deletedBy: User; // 修改这里
  deletedAt: string;
}