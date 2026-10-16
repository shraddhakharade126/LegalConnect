import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import { connectDB } from './src/server/config/db.ts';
import { seedDatabase } from './src/server/seed.ts';
import authRouter from './src/server/routes/auth.ts';
import lawyersRouter from './src/server/routes/lawyers.ts';
import appointmentsRouter from './src/server/routes/appointments.ts';
import documentsRouter from './src/server/routes/documents.ts';
import reviewsRouter from './src/server/routes/reviews.ts';
import notificationsRouter from './src/server/routes/notifications.ts';
import adminRouter from './src/server/routes/admin.ts';
import aiRouter from './src/server/routes/ai.ts';
import systemRouter from './src/server/routes/system.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// REST API Routers
app.use('/api/auth', authRouter);
app.use('/api/lawyers', lawyersRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/ai', aiRouter);
app.use('/api/system', systemRouter);

async function startServer() {
  try {
    // 1. Connect to Database (Atlas or local fallback)
    await connectDB();

    // 2. Seed initial demo data
    await seedDatabase();

    // 3. Vite development / production static serving
    const isProd = process.env.NODE_ENV === 'production';
    if (!isProd) {
      console.log('Mounting Vite dev server middleware on Express...');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      console.log('Serving production static build from dist folder...');
      const distPath = path.resolve(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    // 4. Start listening on Port 3000
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`LegalConnect Server running on port ${PORT} (http://0.0.0.0:${PORT})`);
    });
  } catch (error) {
    console.error('Failed to start LegalConnect server:', error);
    process.exit(1);
  }
}

startServer();
