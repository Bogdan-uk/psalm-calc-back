import Assignment from '../models/Assignment.js';

export const assignKathisma = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { userId, kathismaNumber, date } = req.body;

    const assignment = await Assignment.create({
      userId,
      groupId,
      kathismaNumber,
      date,
    });

    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
};

export const completeAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: 'Задание не найдено' });
    }

    // Проверяем, что задание принадлежит именно этому пользователю
    if (assignment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Вы можете завершать только свои задания' });
    }

    if (assignment.isCompleted) {
      return res.status(400).json({ error: 'Задание уже выполнено' });
    }

    assignment.isCompleted = true;
    assignment.completedAt = new Date();

    await assignment.save();

    res.json(assignment);
  } catch (err) {
    next(err);
  }
};

export const getMyAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({ userId: req.user._id })
      .populate('groupId', 'name')
      .sort({ date: -1 })
      .lean();

    res.json(assignments);
  } catch (err) {
    next(err);
  }
};
