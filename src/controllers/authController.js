import User from '../models/User.js';
import Session from '../models/Session.js';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_EXPIRES = 7 * 24 * 60 * 60 * 1000; // 7 дней
const REFRESH_TOKEN_EXPIRES = 30 * 24 * 60 * 60 * 1000; // 30 дней

const createSession = async (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET || 'psalms-secret-key', { expiresIn: '7d' });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET || 'psalms-refresh-key', { expiresIn: '30d' });

  return await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_EXPIRES),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_EXPIRES),
  });
};

const setSessionCookies = (res, session) => {
  res.cookie('accessToken', session.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: ACCESS_TOKEN_EXPIRES,
  });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: REFRESH_TOKEN_EXPIRES,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: REFRESH_TOKEN_EXPIRES,
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      passwordHash: password,
    });

    const session = await createSession(user._id);
    setSessionCookies(res, session);

    res.status(201).json({
      message: 'Регистрация прошла успешно',
      user
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Неверные данные' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Неверные данные' });
    }

    // Удаляем старые сессии пользователя (опционально)
    await Session.deleteMany({ userId: user._id });

    const session = await createSession(user._id);
    setSessionCookies(res, session);

    res.json({
      message: 'Вход выполнен',
      user
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    if (sessionId) {
      await Session.findByIdAndDelete(sessionId);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');
    
    res.json({ message: 'Выход выполнен успешно' });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    // В authMiddleware мы уже добавили req.user
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};
