import express from 'express';
import * as membershipController from '../controllers/membershipController.js';
import { addUserSchema } from '../validators/membershipValidator.js';
import { authMiddleware } from '../midlleware/authMidlleware.js';
import { requireRole } from '../midlleware/requireRole.js';

const router = express.Router({ mergeParams: true });

// Эти роуты будут доступны по адресу /api/groups/:groupId/admin/...
router.use(authMiddleware);
router.use(requireRole('admin'));

router.post('/add-user', addUserSchema, membershipController.addUserToGroup);
router.get('/members', membershipController.getGroupMembers);

export default router;
