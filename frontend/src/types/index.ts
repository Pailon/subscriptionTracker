export type Subscription = {
  id: number;
  userId: number;
  name: string;
  price: number; // в копейках
  currency: string;
  billingDay: number;
  category: string | null;
  isActive: boolean;
  notifyDaysBefore: number;
  createdAt: string;
  updatedAt: string;
};

export type NewSubscription = {
  name: string;
  price: number; // в рублях
  currency: string;
  billingDay: number;
  category?: string;
  notifyDaysBefore?: number;
};

