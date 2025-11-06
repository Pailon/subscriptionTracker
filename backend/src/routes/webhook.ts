import { Router } from 'express';
import TelegramBot from 'node-telegram-bot-api';

const router = Router();
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: false });

// Webhook endpoint для Telegram
router.post('/', async (req, res) => {
  try {
    const update = req.body;

    // Обрабатываем команду /start
    if (update.message?.text === '/start') {
      const chatId = update.message.chat.id;
      const webAppUrl = process.env.FRONTEND_URL || 'https://your-app.vercel.app';

      await bot.sendMessage(chatId, 'Добро пожаловать в Subscription Tracker! 📱', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 Открыть приложение',
                web_app: { url: webAppUrl },
              },
            ],
          ],
        },
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
});

export default router;

