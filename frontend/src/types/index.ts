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
  periodMonths?: number; // период подписки в месяцах
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
  periodMonths?: number; // период подписки в месяцах
};

