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

import { connectMongoDB } from './db/connectMongoDB.js';
const app = express();
const PORT = process.env.PORT || 3000;
// const PORT = app.use(
//   cors({
//     origin: process.env.PORT || 'http://localhost:3000',
//     credentials: true,
//   }),
// );
app.use(helmet());
app.use(express.json());
app.use(cookieParser()); // Необходим для работы с куками сессий

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
