import express from 'express';
import { 
  createLearningNode, 
  getLearningNodeById, 
  getLearningNodesByPathId,
  getChildNodesByParentId,
  getRootNodesByPathId,
  updateLearningNode,
  deleteLearningNode,
  getNodePath
} from '../models/learning-node';
import { getLearningPathById } from '../models/learning-path';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Create a new learning node
router.post('/', authenticate, async (req, res) => {
  try {
    const { path_id, parent_id, content_type, content_summary, complexity_level } = req.body;
    
    if (!path_id || !content_type) {
      return res.status(400).json({ error: 'Path ID and content type are required' });
    }
    
    // Check if the path belongs to the user
    const path = await getLearningPathById(path_id);
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    
    if (path.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to add nodes to this learning path' });
    }
    
    // If parent_id is provided, check if it belongs to the same path
    if (parent_id) {
      const parentNode = await getLearningNodeById(parent_id);
      if (!parentNode) {
        return res.status(404).json({ error: 'Parent node not found' });
      }
      
      if (parentNode.path_id !== path_id) {
        return res.status(400).json({ error: 'Parent node must belong to the same path' });
      }
    }
    
    const node = await createLearningNode({
      path_id,
      parent_id,
      content_type,
      content_summary,
      complexity_level
    });
    
    res.status(201).json(node);
  } catch (error) {
    console.error('Error creating learning node:', error);
    res.status(500).json({ error: 'Failed to create learning node' });
  }
});

// Get learning node by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const node = await getLearningNodeById(id);
    
    if (!node) {
      return res.status(404).json({ error: 'Learning node not found' });
    }
    
    // Check if the node belongs to a path owned by the user
    const path = await getLearningPathById(node.path_id);
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    
    if (path.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to access this learning node' });
    }
    
    res.json(node);
  } catch (error) {
    console.error('Error getting learning node:', error);
    res.status(500).json({ error: 'Failed to get learning node' });
  }
});

// Get learning nodes by path ID
router.get('/path/:pathId', authenticate, async (req, res) => {
  try {
    const { pathId } = req.params;
    
    // Check if the path belongs to the user
    const path = await getLearningPathById(pathId);
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    
    if (path.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to access nodes in this learning path' });
    }
    
    const nodes = await getLearningNodesByPathId(pathId);
    res.json(nodes);
  } catch (error) {
    console.error('Error getting learning nodes:', error);
    res.status(500).json({ error: 'Failed to get learning nodes' });
  }
});

// Get child nodes by parent ID
router.get('/parent/:parentId', authenticate, async (req, res) => {
  try {
    const { parentId } = req.params;
    const parentNode = await getLearningNodeById(parentId);
    
    if (!parentNode) {
      return res.status(404).json({ error: 'Parent node not found' });
    }
    
    // Check if the parent node belongs to a path owned by the user
    const path = await getLearningPathById(parentNode.path_id);
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    
    if (path.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to access nodes in this learning path' });
    }
    
    const childNodes = await getChildNodesByParentId(parentId);
    res.json(childNodes);
  } catch (error) {
    console.error('Error getting child nodes:', error);
    res.status(500).json({ error: 'Failed to get child nodes' });
  }
});

// Get root nodes by path ID
router.get('/path/:pathId/roots', authenticate, async (req, res) => {
  try {
    const { pathId } = req.params;
    
    // Check if the path belongs to the user
    const path = await getLearningPathById(pathId);
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    
    if (path.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to access nodes in this learning path' });
    }
    
    const rootNodes = await getRootNodesByPathId(pathId);
    res.json(rootNodes);
  } catch (error) {
    console.error('Error getting root nodes:', error);
    res.status(500).json({ error: 'Failed to get root nodes' });
  }
});

// Get node path from root to the specified node
router.get('/:id/path', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const node = await getLearningNodeById(id);
    
    if (!node) {
      return res.status(404).json({ error: 'Learning node not found' });
    }
    
    // Check if the node belongs to a path owned by the user
    const path = await getLearningPathById(node.path_id);
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    
    if (path.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to access nodes in this learning path' });
    }
    
    const nodePath = await getNodePath(id);
    res.json(nodePath);
  } catch (error) {
    console.error('Error getting node path:', error);
    res.status(500).json({ error: 'Failed to get node path' });
  }
});

// Update learning node
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { content_summary, complexity_level } = req.body;
    
    const node = await getLearningNodeById(id);
    
    if (!node) {
      return res.status(404).json({ error: 'Learning node not found' });
    }
    
    // Check if the node belongs to a path owned by the user
    const path = await getLearningPathById(node.path_id);
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    
    if (path.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this learning node' });
    }
    
    const updatedNode = await updateLearningNode(id, {
      content_summary,
      complexity_level
    });
    
    res.json(updatedNode);
  } catch (error) {
    console.error('Error updating learning node:', error);
    res.status(500).json({ error: 'Failed to update learning node' });
  }
});

// Delete learning node
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const node = await getLearningNodeById(id);
    
    if (!node) {
      return res.status(404).json({ error: 'Learning node not found' });
    }
    
    // Check if the node belongs to a path owned by the user
    const path = await getLearningPathById(node.path_id);
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    
    if (path.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this learning node' });
    }
    
    await deleteLearningNode(id);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting learning node:', error);
    res.status(500).json({ error: 'Failed to delete learning node' });
  }
});

export default router; 