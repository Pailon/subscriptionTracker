import { Router } from 'express';
import { db } from '../db';
import { subscriptions, users } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { telegramAuthMiddleware, AuthenticatedRequest } from '../middleware/telegram-auth';

const router = Router();

// Получить все подписки пользователя
router.get('/', telegramAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const telegramId = req.telegramUser!.id.toString();

    // Находим или создаём пользователя
    let [user] = await db.select().from(users).where(eq(users.telegramId, telegramId));

    if (!user) {
      [user] = await db
        .insert(users)
        .values({
          telegramId,
          username: req.telegramUser!.username,
          firstName: req.telegramUser!.first_name,
          lastName: req.telegramUser!.last_name,
        })
        .returning();
    }

    // Получаем подписки
    const userSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .orderBy(desc(subscriptions.createdAt));

    res.json(userSubscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Создать новую подписку
router.post('/', telegramAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const telegramId = req.telegramUser!.id.toString();
    const { name, price, currency, billingDay, category, notifyDaysBefore } = req.body;

    // Валидация
    if (!name || !price || !billingDay) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (billingDay < 1 || billingDay > 31) {
      return res.status(400).json({ error: 'Billing day must be between 1 and 31' });
    }

    // Находим пользователя
    const [user] = await db.select().from(users).where(eq(users.telegramId, telegramId));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Создаём подписку
    const [subscription] = await db
      .insert(subscriptions)
      .values({
        userId: user.id,
        name,
        price: Math.round(price * 100), // конвертируем в копейки
        currency: currency || 'RUB',
        billingDay,
        category: category || null,
        notifyDaysBefore: notifyDaysBefore || 1,
      })
      .returning();

    return res.status(201).json(subscription);
  } catch (error) {
    console.error('Error creating subscription:', error);
    return res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Обновить подписку
router.patch('/:id', telegramAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const telegramId = req.telegramUser!.id.toString();
    const subscriptionId = parseInt(req.params.id, 10);
    const updates = req.body;

    // Находим пользователя
    const [user] = await db.select().from(users).where(eq(users.telegramId, telegramId));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Конвертируем price в копейки если он есть
    if (updates.price !== undefined) {
      updates.price = Math.round(updates.price * 100);
    }

    // Обновляем подписку
    const [updated] = await db
      .update(subscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(subscriptions.id, subscriptionId), eq(subscriptions.userId, user.id)))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    return res.json(updated);
  } catch (error) {
    console.error('Error updating subscription:', error);
    return res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// Удалить подписку
router.delete('/:id', telegramAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const telegramId = req.telegramUser!.id.toString();
    const subscriptionId = parseInt(req.params.id, 10);

    // Находим пользователя
    const [user] = await db.select().from(users).where(eq(users.telegramId, telegramId));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Удаляем подписку
    const [deleted] = await db
      .delete(subscriptions)
      .where(and(eq(subscriptions.id, subscriptionId), eq(subscriptions.userId, user.id)))
      .returning();

    if (!deleted) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    return res.json({ message: 'Subscription deleted' });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return res.status(500).json({ error: 'Failed to delete subscription' });
  }
});

export default router;

