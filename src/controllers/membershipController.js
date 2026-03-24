import Membership from '../models/Membership.js';

export const addUserToGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    // Проверяем, нет ли уже такого участника
    const existingMembership = await Membership.findOne({ userId, groupId });
    if (existingMembership) {
      return res.status(400).json({ error: 'Пользователь уже является участником этой группы' });
    }

    const membership = await Membership.create({
      userId,
      groupId,
      role: 'reader', // по умолчанию все новые - читатели
    });

    res.status(201).json(membership);
  } catch (err) {
    next(err);
  }
};

export const getGroupMembers = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const members = await Membership.find({ groupId })
      .populate('userId', 'name email')
      .lean();

    res.json(members);
  } catch (err) {
    next(err);
  }
};
