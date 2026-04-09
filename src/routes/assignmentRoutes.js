import express from 'express';
import * as assignmentController from '../controllers/assignmentController.js';
import { assignKathismaSchema, completeAssignmentSchema, getTodaySchema, getScheduleSchema } from '../validators/assignmentValidator.js';
import { authMiddleware } from '../midlleware/authMidlleware.js';
import { requireRole } from '../midlleware/requireRole.js';

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

// Назначение кафизмы (только админ)
router.post(
  '/:groupId/assign',
  requireRole('admin'),
  assignKathismaSchema,
  assignmentController.assignKathisma
);

// Завершение задания (любой участник для своего задания)
router.post(
  '/:groupId/complete/:assignmentId',
  completeAssignmentSchema,
  assignmentController.completeAssignment
);

/**
 * @swagger
 * /api/assignments/{groupId}/today:
 *   get:
 *     summary: Get user's kathisma for today based on group rotation rules
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Today's kathisma(s)
 */
router.get('/:groupId/today', requireRole(), getTodaySchema, assignmentController.getKathismaForToday);

/**
 * @swagger
 * /api/assignments/{groupId}/schedule:
 *   get:
 *     summary: Get user's personal schedule for the next N days
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *     responses:
 *       200:
 *         description: List of scheduled kathismas
 */
router.get('/:groupId/schedule', requireRole(), getScheduleSchema, assignmentController.getGroupSchedule);

/**
 * @swagger
 * /api/assignments/{groupId}/debug-full-schedule:
 *   get:
 *     summary: Get complete schedule for all members (for verification)
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *     responses:
 *       200:
 *         description: Full group schedule
 */
router.get('/:groupId/debug-full-schedule', requireRole(), getTodaySchema, assignmentController.getFullGroupSchedule);

// Мои задания
router.get('/my', assignmentController.getMyAssignments);

export default router;
