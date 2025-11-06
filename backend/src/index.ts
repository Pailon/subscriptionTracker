import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import subscriptionsRouter from './routes/subscriptions';
import webhookRouter from './routes/webhook';
import { checkAndNotifySubscriptions } from './services/notification.service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/webhook', webhookRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Cron job: проверка подписок каждый день в 9:00
cron.schedule('0 9 * * *', () => {
  console.log('Running subscription check...');
  checkAndNotifySubscriptions();
});

// Для разработки: проверка каждый час
if (process.env.NODE_ENV === 'development') {
  cron.schedule('0 * * * *', () => {
    console.log('[DEV] Running hourly subscription check...');
    checkAndNotifySubscriptions();
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

