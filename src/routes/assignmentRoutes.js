import express from 'express';
import * as assignmentController from '../controllers/assignmentController.js';
import { assignKathismaSchema, completeAssignmentSchema } from '../validators/assignmentValidator.js';
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

// Мои задания
router.get('/my', assignmentController.getMyAssignments);

export default router;
