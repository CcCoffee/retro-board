export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface LikeUser {
  userId: string;
  username: string;
}

export interface RetroCard {
  id?: number;
  type: string;
  content: string;
  isAnonymous: boolean;
  authorId: string;
  authorName: string;
  likes: LikeUser[];
  createdAt: string;
}

export interface ActionItem {
  id?: number;
  assigneeId: string;
  assigneeName: string;
  dueDate: string;
  content: string;
  createdAt: string;
}

export interface RetroBoardHistory {
  id: number;
  cards: RetroCard[];
  deletedByUserId: string;
  deletedByUsername: string;
  deletedAt: string;
}