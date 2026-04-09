import Group from '../models/Group.js';
import Membership from '../models/Membership.js';

export const createGroup = async (req, res, next) => {
  try {
    const { name, isLostListEnabled, rotationType, startDate, totalKathismas } = req.body;

    const group = await Group.create({
      name,
      isLostListEnabled: isLostListEnabled || false,
      rotationType: rotationType || 'sequential',
      startDate: startDate || new Date(),
      totalKathismas: totalKathismas || 20,
      createdBy: req.user._id,
    });

    // Создатель группы становится админом автоматически
    await Membership.create({
      userId: req.user._id,
      groupId: group._id,
      role: 'admin',
      sequenceOrder: 0,
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

    // Извлекаем только объекты групп из членств и добавляем количество участников
    const groups = await Promise.all(memberships.map(async (m) => {
      const memberCount = await Membership.countDocuments({ groupId: m.groupId._id });
      return {
        ...m.groupId,
        userRole: m.role,
        memberCount
      };
    }));

    res.json(groups);
  } catch (err) {
    next(err);
  }
};

export const getGroupById = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId).lean();

    if (!group) {
      return res.status(404).json({ error: 'Группа не найдена' });
    }

    // Добавляем список участников в ответ
    const members = await Membership.find({ groupId })
      .populate('userId', 'name email')
      .select('userId role joinedAt')
      .lean();

    res.json({
      ...group,
      members
    });
  } catch (err) {
    next(err);
  }
};

export const updateGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { name, description, isLostListEnabled, rotationType, startDate, totalKathismas } = req.body;

    const group = await Group.findByIdAndUpdate(
      groupId,
      { name, description, isLostListEnabled, rotationType, startDate, totalKathismas },
      { new: true, runValidators: true }
    );

    if (!group) {
      return res.status(404).json({ error: 'Группа не найдена' });
    }

    res.json(group);
  } catch (err) {
    next(err);
  }
};

export const getGroupNames = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Группа не найдена' });
    }

    const memberships = await Membership.find({ groupId }).select('healthNames reposeNames lostNames');

    const aggregatedNames = {
      healthNames: [...new Set(memberships.flatMap(m => m.healthNames || []))],
      reposeNames: [...new Set(memberships.flatMap(m => m.reposeNames || []))],
      lostNames: group.isLostListEnabled 
        ? [...new Set(memberships.flatMap(m => m.lostNames || []))]
        : [],
      isLostListEnabled: group.isLostListEnabled
    };

    res.json(aggregatedNames);
  } catch (err) {
    next(err);
  }
};
