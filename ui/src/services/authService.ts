import { User } from "@/types/retro";
import axiosInstance from "@/config/axiosConfig";

export const authService = {
  login: async (username: string, password: string): Promise<User> => {
    try {
      const data:URLSearchParams = new URLSearchParams();
      data.append('username', username);
      data.append('password', password);
      const response = await axiosInstance.post('/login', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      const user: User = response.data;
      authService.setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post('/logout');
      localStorage.removeItem("user");
    } catch (error) {
      console.error('登出失败:', error);
      throw error;
    }
  },

  getCurrentUser: (): User | null => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  },

  setCurrentUser: (user: User): void => {
    localStorage.setItem("user", JSON.stringify(user));
  },
};