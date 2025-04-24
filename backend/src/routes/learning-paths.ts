import express from 'express';
import { 
  createLearningPath, 
  getLearningPathById, 
  getLearningPathsByUserId, 
  getLearningPathsBySessionId,
  updateLearningPath,
  deleteLearningPath
} from '../models/learning-path';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Create a new learning path
router.post('/', authenticate, async (req, res) => {
  try {
    const { session_id, topic_id, name, description } = req.body;
    
    if (!session_id) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    const path = await createLearningPath({
      user_id: req.user.id,
      session_id,
      topic_id,
      name,
      description
    });
    
    res.status(201).json(path);
  } catch (error) {
    console.error('Error creating learning path:', error);
    res.status(500).json({ error: 'Failed to create learning path' });
  }
});

// Get learning path by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const path = await getLearningPathById(id);
    
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    
    // Check if the path belongs to the user
    if (path.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to access this learning path' });
    }
    
    res.json(path);
  } catch (error) {
    console.error('Error getting learning path:', error);
    res.status(500).json({ error: 'Failed to get learning path' });
  }
});

// Get learning paths by user ID
router.get('/user/me', authenticate, async (req, res) => {
  try {
    const paths = await getLearningPathsByUserId(req.user.id);
    res.json(paths);
  } catch (error) {
    console.error('Error getting learning paths:', error);
    res.status(500).json({ error: 'Failed to get learning paths' });
  }
});

// Get learning paths by session ID
router.get('/session/:sessionId', authenticate, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const paths = await getLearningPathsBySessionId(sessionId);
    
    // Filter paths to only include those belonging to the user
    const userPaths = paths.filter(path => path.user_id === req.user.id);
    
    res.json(userPaths);
  } catch (error) {
    console.error('Error getting learning paths:', error);
    res.status(500).json({ error: 'Failed to get learning paths' });
  }
});

// Update learning path
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, topic_id } = req.body;
    
    const path = await getLearningPathById(id);
    
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    
    // Check if the path belongs to the user
    if (path.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this learning path' });
    }
    
    const updatedPath = await updateLearningPath(id, {
      name,
      description,
      topic_id
    });
    
    res.json(updatedPath);
  } catch (error) {
    console.error('Error updating learning path:', error);
    res.status(500).json({ error: 'Failed to update learning path' });
  }
});

// Delete learning path
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const path = await getLearningPathById(id);
    
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    
    // Check if the path belongs to the user
    if (path.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this learning path' });
    }
    
    await deleteLearningPath(id);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting learning path:', error);
    res.status(500).json({ error: 'Failed to delete learning path' });
  }
});

export default router; 