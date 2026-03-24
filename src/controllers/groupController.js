import Group from '../models/Group.js';
import Membership from '../models/Membership.js';

export const createGroup = async (req, res, next) => {
  try {
    const { name } = req.body;

    const group = await Group.create({
      name,
      createdBy: req.user._id,
    });

    // Создатель группы становится админом автоматически
    await Membership.create({
      userId: req.user._id,
      groupId: group._id,
      role: 'admin',
    });

    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
};

export const getMyGroups = async (req, res, next) => {
  try {
    const memberships = await Membership.find({ userId: req.user._id })
      .populate('groupId')
      .lean();

    // Извлекаем только объекты групп из членств
    const groups = memberships.map(m => ({
      ...m.groupId,
      userRole: m.role
    }));

    res.json(groups);
  } catch (err) {
    next(err);
  }
};

export const getGroupById = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: 'Группа не найдена' });
    }

    res.json(group);
  } catch (err) {
    next(err);
  }
};
