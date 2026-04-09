import Membership from '../models/Membership.js';

export const requireRole = (role) => {
  return async (req, res, next) => {
    try {
      const groupId = req.params.groupId || req.body.groupId;

      if (!groupId) {
        return res.status(400).json({ error: 'Идентификатор группы обязателен' });
      }

      const membership = await Membership.findOne({
        userId: req.user._id,
        groupId,
      });

      if (!membership) {
        return res.status(403).json({ error: 'Вы не являетесь участником этой группы' });
      }

      if (role) {
        const roles = Array.isArray(role) ? role : [role];
        if (!roles.includes(membership.role)) {
          return res.status(403).json({ error: 'У вас недостаточно прав для этого действия' });
        }
      }

      req.membership = membership; // сохраняем членство для дальнейшего использования
      next();
    } catch (err) {
      next(err);
    }
  };
};
