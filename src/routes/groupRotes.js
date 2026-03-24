import express from 'express';
import * as groupController from '../controllers/groupController.js';
import { createGroupSchema } from '../validators/groupValidator.js';
import { authMiddleware } from '../midlleware/authMidlleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createGroupSchema, groupController.createGroup);
router.get('/', groupController.getMyGroups);
router.get('/:groupId', groupController.getGroupById);

export default router;
