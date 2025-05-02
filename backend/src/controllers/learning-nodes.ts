import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

export const createLearningNode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, difficulty, topic } = req.body;

    // Validate required fields
    if (!title || !content || !difficulty || !topic) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: title, content, difficulty, topic',
      });
      return;
    }

    // Create learning node
    const { data, error } = await supabase
      .from('learning_nodes')
      .insert([
        {
          title,
          content,
          difficulty,
          topic,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      logger.error('Error creating learning node:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create learning node',
      });
      return;
    }

    res.status(201).json({
      success: true,
      data: {
        learningNode: data,
      },
    });
  } catch (error) {
    logger.error('Error in createLearningNode:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getLearningNode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Learning node ID is required',
      });
      return;
    }

    const { data, error } = await supabase
      .from('learning_nodes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      logger.error('Error fetching learning node:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch learning node',
      });
      return;
    }

    if (!data) {
      res.status(404).json({
        success: false,
        error: 'Learning node not found',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        learningNode: data,
      },
    });
  } catch (error) {
    logger.error('Error in getLearningNode:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const updateLearningNode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, difficulty, topic } = req.body;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Learning node ID is required',
      });
      return;
    }

    // Validate at least one field is being updated
    if (!title && !content && !difficulty && !topic) {
      res.status(400).json({
        success: false,
        error: 'At least one field must be updated',
      });
      return;
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (difficulty) updateData.difficulty = difficulty;
    if (topic) updateData.topic = topic;

    const { data, error } = await supabase
      .from('learning_nodes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating learning node:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update learning node',
      });
      return;
    }

    if (!data) {
      res.status(404).json({
        success: false,
        error: 'Learning node not found',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        learningNode: data,
      },
    });
  } catch (error) {
    logger.error('Error in updateLearningNode:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const deleteLearningNode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Learning node ID is required',
      });
      return;
    }

    const { error } = await supabase
      .from('learning_nodes')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Error deleting learning node:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete learning node',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Learning node deleted successfully',
    });
  } catch (error) {
    logger.error('Error in deleteLearningNode:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}; 