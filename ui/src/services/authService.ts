import { User } from "@/types/retro";
import axiosInstance from "@/config/axiosConfig";
import { showToast } from "@/utils/toast";

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
      showToast.success("Login successful");
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      showToast.error("Login failed, please check your username and password");
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post('/logout');
      localStorage.removeItem("user");
      showToast.info("You have successfully logged out");
    } catch (error) {
      console.error('Logout failed:', error);
      showToast.error("Logout failed, please try again later");
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