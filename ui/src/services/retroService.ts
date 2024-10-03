import { RetroCard, ActionItem } from "@/types";
import axiosInstance from "@/config/axiosConfig";
import { showToast } from "@/utils/toast";

export const retroService = {
  getCards: async (): Promise<RetroCard[]> => {
    try {
      const response = await axiosInstance.get(`/retro-cards`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch retro cards:', error);
      showToast.error("Failed to fetch retro cards");
      throw error;
    }
  },

  saveCard: async (card: RetroCard): Promise<RetroCard> => {
    try {
      const response = await axiosInstance.post(`/retro-cards`, card);
      showToast.success("Retro card saved successfully");
      return response.data;
    } catch (error) {
      console.error('Failed to save retro card:', error);
      showToast.error("Failed to save retro card");
      throw error;
    }
  },

  updateCard: async (card: RetroCard): Promise<RetroCard> => {
    try {
      const response = await axiosInstance.put(`/retro-cards/${card.id}`, card);
      showToast.success("Retro card updated successfully");
      return response.data;
    } catch (error) {
      console.error('Failed to update retro card:', error);
      showToast.error("Failed to update retro card");
      throw error;
    }
  },

  deleteCard: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/retro-cards/${id}`);
      showToast.success("Retro card deleted successfully");
    } catch (error) {
      console.error('Failed to delete retro card:', error);
      showToast.error("Failed to delete retro card");
      throw error;
    }
  },

  getActionItems: async (): Promise<ActionItem[]> => {
    try {
      const response = await axiosInstance.get(`/action-items`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch action items:', error);
      showToast.error("Failed to fetch action items");
      throw error;
    }
  },

  saveActionItem: async (actionItem: ActionItem): Promise<ActionItem> => {
    try {
      const response = await axiosInstance.post(`/action-items`, actionItem);
      showToast.success("Action item saved successfully");
      return response.data;
    } catch (error) {
      console.error('Failed to save action item:', error);
      showToast.error("Failed to save action item");
      throw error;
    }
  },

  updateActionItem: async (actionItem: ActionItem): Promise<ActionItem> => {
    try {
      const response = await axiosInstance.put(`/action-items/${actionItem.id}`, actionItem);
      showToast.success("Action item updated successfully");
      return response.data;
    } catch (error) {
      console.error('Failed to update action item:', error);
      showToast.error("Failed to update action item");
      throw error;
    }
  },

  deleteActionItem: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/action-items/${id}`);
      showToast.success("Action item deleted successfully");
    } catch (error) {
      console.error('Failed to delete action item:', error);
      showToast.error("Failed to delete action item");
      throw error;
    }
  },

  clearBoard: async (): Promise<void> => {
    try {
      await axiosInstance.post('/retro-cards/clear');
      showToast.success("Retro board cleaned successfully");
    } catch (error) {
      console.error('Failed to clean retro board:', error);
      showToast.error("Failed to clean retro board");
      throw error;
    }
  },
};