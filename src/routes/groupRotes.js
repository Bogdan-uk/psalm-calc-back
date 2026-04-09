import express from 'express';
import * as groupController from '../controllers/groupController.js';
import * as membershipController from '../controllers/membershipController.js';
import { createGroupSchema, updateGroupSchema } from '../validators/groupValidator.js';
import { updateNamesSchema } from '../validators/membershipValidator.js';
import { authMiddleware } from '../midlleware/authMidlleware.js';
import { requireRole } from '../midlleware/requireRole.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               isLostListEnabled:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Group created
 *   get:
 *     summary: Get all groups of the current user
 *     tags: [Groups]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of groups
 */
router.post('/', createGroupSchema, groupController.createGroup);
router.get('/', groupController.getMyGroups);

/**
 * @swagger
 * /api/groups/{groupId}:
 *   get:
 *     summary: Get group by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group details
 *   patch:
 *     summary: Update group (Admin only)
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isLostListEnabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Group updated
 */
router.get('/:groupId', groupController.getGroupById);
router.patch('/:groupId', requireRole('admin'), updateGroupSchema, groupController.updateGroup);

/**
 * @swagger
 * /api/groups/{groupId}/names:
 *   get:
 *     summary: Get aggregated group names
 *     tags: [Names]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Aggregated lists of names
 */
router.get('/:groupId/names', requireRole(), groupController.getGroupNames);

/**
 * @swagger
 * /api/groups/{groupId}/my-names:
 *   get:
 *     summary: Get current user's names in group
 *     tags: [Names]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User's names
 *   patch:
 *     summary: Update current user's names in group
 *     tags: [Names]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               healthNames:
 *                 type: array
 *                 items:
 *                   type: string
 *               reposeNames:
 *                 type: array
 *                 items:
 *                   type: string
 *               lostNames:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Names updated
 */
router.get('/:groupId/my-names', requireRole(), membershipController.getMyNames);
router.patch('/:groupId/my-names', requireRole(), updateNamesSchema, membershipController.updateMyNames);

export default router;
