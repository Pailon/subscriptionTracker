import { create } from 'zustand';
import { Subscription, NewSubscription } from '../types';
import * as api from '../lib/api';

type SubscriptionStore = {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;
  fetchSubscriptions: () => Promise<void>;
  addSubscription: (data: NewSubscription) => Promise<void>;
  // TODO: Вернуть методы редактирования и удаления для модалки редактирования
  // updateSubscription: (id: number, data: Partial<NewSubscription>) => Promise<void>;
  // deleteSubscription: (id: number) => Promise<void>;
};

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  subscriptions: [],
  isLoading: false,
  error: null,

  fetchSubscriptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const subscriptions = await api.getSubscriptions();
      set({ subscriptions, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addSubscription: async (data: NewSubscription) => {
    set({ isLoading: true, error: null });
    try {
      const newSubscription = await api.createSubscription(data);
      set((state) => ({
        subscriptions: [newSubscription, ...state.subscriptions],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  // TODO: Вернуть методы редактирования и удаления для модалки редактирования
  /*
  updateSubscription: async (id: number, data: Partial<NewSubscription>) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await api.updateSubscription(id, data);
      set((state) => ({
        subscriptions: state.subscriptions.map((sub) =>
          sub.id === id ? updated : sub
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteSubscription: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteSubscription(id);
      set((state) => ({
        subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  */
}));

