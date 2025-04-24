import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

export interface LearningPath {
  id: string;
  user_id: string;
  session_id: string;
  topic_id: string | null;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateLearningPathParams {
  user_id: string;
  session_id: string;
  topic_id?: string;
  name?: string;
  description?: string;
}

export interface UpdateLearningPathParams {
  name?: string;
  description?: string;
  topic_id?: string;
}

// Create a new learning path
export async function createLearningPath(params: CreateLearningPathParams): Promise<LearningPath> {
  const { data, error } = await supabase
    .from('learning_paths')
    .insert([{
      user_id: params.user_id,
      session_id: params.session_id,
      topic_id: params.topic_id || null,
      name: params.name || 'New Learning Path',
      description: params.description || null
    }])
    .select()
    .single();

  if (error) {
    logger.error('Error creating learning path:', error);
    throw error;
  }
  
  return data;
}

// Get learning path by ID
export async function getLearningPathById(id: string): Promise<LearningPath | null> {
  const { data, error } = await supabase
    .from('learning_paths')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    logger.error('Error getting learning path:', error);
    throw error;
  }
  
  return data;
}

// Get learning paths by user ID
export async function getLearningPathsByUserId(userId: string): Promise<LearningPath[]> {
  const { data, error } = await supabase
    .from('learning_paths')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Error getting learning paths:', error);
    throw error;
  }
  
  return data || [];
}

// Get learning paths by session ID
export async function getLearningPathsBySessionId(sessionId: string): Promise<LearningPath[]> {
  const { data, error } = await supabase
    .from('learning_paths')
    .select()
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    logger.error('Error getting learning paths:', error);
    throw error;
  }
  
  return data || [];
}

// Update learning path
export async function updateLearningPath(id: string, params: UpdateLearningPathParams): Promise<LearningPath> {
  const { data, error } = await supabase
    .from('learning_paths')
    .update({
      name: params.name,
      description: params.description,
      topic_id: params.topic_id,
      updated_at: new Date()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Error updating learning path:', error);
    throw error;
  }
  
  return data;
}

// Delete learning path
export async function deleteLearningPath(id: string): Promise<void> {
  const { error } = await supabase
    .from('learning_paths')
    .delete()
    .eq('id', id);

  if (error) {
    logger.error('Error deleting learning path:', error);
    throw error;
  }
} 