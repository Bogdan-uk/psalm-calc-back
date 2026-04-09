import Assignment from '../models/Assignment.js';
import Group from '../models/Group.js';
import Membership from '../models/Membership.js';

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

function generateCalendar(daysCount, usersCount, totalKathismas, rotationType, userIndex = null) {
  const calendar = [];
  let k = 1;
  let vUsers = Array.from({ length: usersCount }, (_, i) => i);

  if (rotationType === 'sequential') {
    for (let d = 0; d < daysCount; d++) {
      const dayIndex = d;
      const dayData = { day: d + 1, users: [] };
      
      for (let uIdx = 0; uIdx < usersCount; uIdx++) {
        const kathisma = ((uIdx + dayIndex) % totalKathismas) + 1;
        dayData.users.push({ userIndex: uIdx, kathismas: [kathisma] });
      }
      
      if (userIndex !== null) {
        calendar.push({
          day: d + 1,
          kathismas: dayData.users.find(u => u.userIndex === userIndex).kathismas
        });
      } else {
        calendar.push(dayData);
      }
    }
    return calendar;
  }

  // logic for 'shift'
  const fullCalendar = [];
  for (let d = 0; d < daysCount * 2; d++) {
    if (d > 0) {
      vUsers.unshift(vUsers.pop());
    }
    
    let remainingK = totalKathismas - k + 1;
    if (remainingK > 0 && remainingK < usersCount && d > 0) {
      if (fullCalendar.length > 0) {
        const prevDay = fullCalendar[fullCalendar.length - 1];
        for (let i = 0; i < remainingK; i++) {
          const u = vUsers[i];
          prevDay.find(r => r.user === u).list.push(k);
          k++;
          if (k > totalKathismas) k = 1;
        }
      }
      vUsers.unshift(vUsers.pop());
      k = 1;
      d--; 
      continue;
    }

    let dayResults = [];
    for (let i = 0; i < usersCount; i++) {
      let u = vUsers[i];
      dayResults.push({ user: u, list: [k] });
      k++;
      if (k > totalKathismas) k = 1;
    }
    fullCalendar.push(dayResults);
    if (fullCalendar.length >= daysCount) break;
  }

  if (userIndex !== null) {
    return fullCalendar.map((dayData, idx) => ({
      day: idx + 1,
      kathismas: dayData.find(r => r.user === userIndex).list
    }));
  } else {
    return fullCalendar.map((dayData, idx) => ({
      day: idx + 1,
      users: dayData.map(r => ({ userIndex: r.user, kathismas: r.list }))
    }));
  }
}

export const getFullGroupSchedule = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const days = parseInt(req.query.days) || 7;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Группа не найдена' });

    const members = await Membership.find({ groupId })
      .populate('userId', 'name')
      .sort({ sequenceOrder: 1 });
    
    const usersCount = members.length;
    if (usersCount === 0) return res.json({ message: 'В группе нет участников', schedule: [] });

    const startDate = new Date(group.startDate);
    startDate.setHours(0, 0, 0, 0);

    const fullSchedule = generateCalendar(days, usersCount, group.totalKathismas || 20, group.rotationType);
    
    const formattedSchedule = fullSchedule.map(s => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + s.day - 1);
      return {
        day: s.day,
        date: d.toISOString().split('T')[0],
        assignments: s.users.map(u => ({
          userName: members[u.userIndex].userId.name,
          userRole: members[u.userIndex].role,
          kathismas: u.kathismas
        }))
      };
    });

    res.json({
      groupName: group.name,
      rotationType: group.rotationType,
      schedule: formattedSchedule
    });

  } catch (err) {
    next(err);
  }
};

export const getKathismaForToday = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Группа не найдена' });

    const membership = await Membership.findOne({ userId, groupId });
    if (!membership) return res.status(403).json({ error: 'Вы не участник этой группы' });

    const members = await Membership.find({ groupId }).sort({ sequenceOrder: 1 });
    const usersCount = members.length;
    const userIndex = members.findIndex(m => m.userId.toString() === userId.toString());

    const startDate = new Date(group.startDate);
    startDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - startDate.getTime();
    const dayIndex = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (dayIndex < 0) return res.json({ message: 'Чтение еще не началось', startDate: group.startDate });

    const schedule = generateCalendar(dayIndex + 1, usersCount, group.totalKathismas || 20, group.rotationType, userIndex);
    const todayResult = schedule[dayIndex];

    res.json({
      day: dayIndex + 1,
      kathismas: todayResult.kathismas,
      rotationType: group.rotationType
    });

  } catch (err) {
    next(err);
  }
};

export const getGroupSchedule = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;
    const days = parseInt(req.query.days) || 30;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Группа не найдена' });

    const membership = await Membership.findOne({ userId, groupId });
    if (!membership) return res.status(403).json({ error: 'Вы не участник этой группы' });

    const members = await Membership.find({ groupId }).sort({ sequenceOrder: 1 });
    const usersCount = members.length;
    const userIndex = members.findIndex(m => m.userId.toString() === userId.toString());

    const startDate = new Date(group.startDate);
    startDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - startDate.getTime();
    const currentDayIndex = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Начало отображения расписания - сегодня или день начала (если он в будущем)
    const startDisplayIndex = Math.max(0, currentDayIndex);
    const endDisplayIndex = startDisplayIndex + days;

    const fullSchedule = generateCalendar(endDisplayIndex, usersCount, group.totalKathismas || 20, group.rotationType, userIndex);
    
    const slice = fullSchedule.slice(startDisplayIndex, endDisplayIndex).map(s => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + s.day - 1);
      return {
        ...s,
        date: d.toISOString().split('T')[0]
      };
    });

    res.json({
      rotationType: group.rotationType,
      schedule: slice
    });

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
