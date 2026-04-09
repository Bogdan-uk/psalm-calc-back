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

    const memberCount = await Membership.countDocuments({ groupId });

    const membership = await Membership.create({
      userId,
      groupId,
      role: 'reader', // по умолчанию все новые - читатели
      sequenceOrder: memberCount,
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
      .select('userId role healthNames reposeNames lostNames joinedAt')
      .lean();

    res.json(members);
  } catch (err) {
    next(err);
  }
};

export const updateMyNames = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { healthNames, reposeNames, lostNames } = req.body;

    const membership = await Membership.findOneAndUpdate(
      { userId: req.user._id, groupId },
      { healthNames, reposeNames, lostNames },
      { new: true, runValidators: true }
    );

    if (!membership) {
      return res.status(404).json({ error: 'Членство в группе не найдено' });
    }

    res.json(membership);
  } catch (err) {
    next(err);
  }
};

export const getMyNames = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const membership = await Membership.findOne({ userId: req.user._id, groupId })
      .select('healthNames reposeNames lostNames');

    if (!membership) {
      return res.status(404).json({ error: 'Членство в группе не найдено' });
    }

    res.json(membership);
  } catch (err) {
    next(err);
  }
};
