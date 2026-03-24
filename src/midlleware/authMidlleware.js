import Session from '../models/Session.js';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const { accessToken, sessionId } = req.cookies;

    if (!accessToken || !sessionId) {
      return res.status(401).json({ error: 'Пожалуйста, авторизуйтесь' });
    }

    // Ищем сессию в базе данных
    const session = await Session.findById(sessionId);

    if (!session || session.accessToken !== accessToken) {
      return res.status(401).json({ error: 'Сессия недействительна или истекла' });
    }

    // Проверяем срок действия
    if (new Date() > session.accessTokenValidUntil) {
      return res.status(401).json({ error: 'Токен доступа истек' });
    }

    const user = await User.findById(session.userId);
    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    req.user = user;
    req.session = session; // для логаута или других целей
    next();
  } catch (err) {
    next(err);
  }
};
