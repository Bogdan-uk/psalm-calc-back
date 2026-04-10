import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import authRoutes from './routes/authRoutes.js';
import groupRoutes from './routes/groupRotes.js';
import adminRoutes from './routes/adminRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import setupSwagger from './utils/swagger.js';

import { connectMongoDB } from './db/connectMongoDB.js';
const app = express();

const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin:
      process.env.PORT || 'http://localhost:3000' || 'http://localhost:3001',
    credentials: true,
  }),
);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", "'unsafe-inline'"],
        'script-src-attr': ["'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
      },
    },
  }),
);

app.use(express.json());
app.use(cookieParser()); // Необходим для работы с куками сессий

// Serve static files
app.use(express.static('public'));

// Swagger documentation
setupSwagger(app);

// Основные роуты
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/groups/:groupId/admin', adminRoutes);
app.use('/api/assignments', assignmentRoutes);

// Обработка ошибок валидации celebrate
app.use(errors());

// Глобальный обработчик ошибок
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
