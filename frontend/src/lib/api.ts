import { Subscription, NewSubscription } from '../types';
import { getInitData } from './telegram';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const initData = getInitData();

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Telegram-Init-Data': initData,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export async function getSubscriptions(): Promise<Subscription[]> {
  return fetchWithAuth('/subscriptions');
}

export async function createSubscription(data: NewSubscription): Promise<Subscription> {
  return fetchWithAuth('/subscriptions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSubscription(
  id: number,
  data: Partial<NewSubscription>
): Promise<Subscription> {
  return fetchWithAuth(`/subscriptions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteSubscription(id: number): Promise<void> {
  return fetchWithAuth(`/subscriptions/${id}`, {
    method: 'DELETE',
  });
}

