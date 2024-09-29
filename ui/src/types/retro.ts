export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface RetroCard {
  id: string;
  type: string;
  content: string;
  isAnonymous: boolean;
  author: string;
  likes: string[];
  // 添加发布时间字段
  createdAt: string;
}

export interface ActionItem {
  id: string;
  assignee: string;
  dueDate: string;
  content: string;
}
