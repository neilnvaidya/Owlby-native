import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

export type ContentType = 'standard' | 'deep_dive' | 'test' | 'practice';

export interface LearningNode {
  id: string;
  path_id: string;
  parent_id: string | null;
  content_type: ContentType;
  content_summary: string | null;
  complexity_level: number | null;
  created_at: Date;
}

export interface CreateLearningNodeParams {
  path_id: string;
  parent_id?: string;
  content_type: ContentType;
  content_summary?: string;
  complexity_level?: number;
}

export interface UpdateLearningNodeParams {
  content_summary?: string;
  complexity_level?: number;
}

// Create a new learning node
export async function createLearningNode(params: CreateLearningNodeParams): Promise<LearningNode> {
  const { data, error } = await supabase
    .from('learning_nodes')
    .insert([{
      path_id: params.path_id,
      parent_id: params.parent_id || null,
      content_type: params.content_type,
      content_summary: params.content_summary || null,
      complexity_level: params.complexity_level || null
    }])
    .select()
    .single();

  if (error) {
    logger.error('Error creating learning node:', error);
    throw error;
  }
  
  return data;
}

// Get learning node by ID
export async function getLearningNodeById(id: string): Promise<LearningNode | null> {
  const { data, error } = await supabase
    .from('learning_nodes')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    logger.error('Error getting learning node:', error);
    throw error;
  }
  
  return data;
}

// Get learning nodes by path ID
export async function getLearningNodesByPathId(pathId: string): Promise<LearningNode[]> {
  const { data, error } = await supabase
    .from('learning_nodes')
    .select()
    .eq('path_id', pathId)
    .order('created_at', { ascending: true });

  if (error) {
    logger.error('Error getting learning nodes:', error);
    throw error;
  }
  
  return data || [];
}

// Get child nodes by parent ID
export async function getChildNodesByParentId(parentId: string): Promise<LearningNode[]> {
  const { data, error } = await supabase
    .from('learning_nodes')
    .select()
    .eq('parent_id', parentId)
    .order('created_at', { ascending: true });

  if (error) {
    logger.error('Error getting child nodes:', error);
    throw error;
  }
  
  return data || [];
}

// Get root nodes by path ID (nodes without a parent)
export async function getRootNodesByPathId(pathId: string): Promise<LearningNode[]> {
  const { data, error } = await supabase
    .from('learning_nodes')
    .select()
    .eq('path_id', pathId)
    .is('parent_id', null)
    .order('created_at', { ascending: true });

  if (error) {
    logger.error('Error getting root nodes:', error);
    throw error;
  }
  
  return data || [];
}

// Update learning node
export async function updateLearningNode(id: string, params: UpdateLearningNodeParams): Promise<LearningNode> {
  const { data, error } = await supabase
    .from('learning_nodes')
    .update({
      content_summary: params.content_summary,
      complexity_level: params.complexity_level
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('Error updating learning node:', error);
    throw error;
  }
  
  return data;
}

// Delete learning node
export async function deleteLearningNode(id: string): Promise<void> {
  const { error } = await supabase
    .from('learning_nodes')
    .delete()
    .eq('id', id);

  if (error) {
    logger.error('Error deleting learning node:', error);
    throw error;
  }
}

// Get the full path from a node to the root
export async function getNodePath(nodeId: string): Promise<LearningNode[]> {
  const path: LearningNode[] = [];
  let currentNode = await getLearningNodeById(nodeId);
  
  if (!currentNode) {
    return path;
  }
  
  path.unshift(currentNode);
  
  while (currentNode.parent_id) {
    currentNode = await getLearningNodeById(currentNode.parent_id);
    if (currentNode) {
      path.unshift(currentNode);
    } else {
      break;
    }
  }
  
  return path;
} 