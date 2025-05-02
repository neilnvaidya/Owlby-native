import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { 
  createLearningNode, 
  getLearningNode,
  updateLearningNode,
  deleteLearningNode,
} from '../controllers/learning-nodes';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create a new learning node
router.post('/', createLearningNode);

// Get a learning node by ID
router.get('/:id', getLearningNode);

// Update a learning node
router.put('/:id', updateLearningNode);

// Delete a learning node
router.delete('/:id', deleteLearningNode);

export default router; 