import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

export interface Topic {
  id: string;
  name: string;
  category: string;
  description: string;
  created_at: Date;
}

export interface CreateTopicParams {
  name: string;
  category: string;
  description: string;
}

export interface UpdateTopicParams {
  name?: string;
  category?: string;
  description?: string;
}

// Create a new topic
export async function createTopic(params: CreateTopicParams): Promise<Topic> {
  const { data, error } = await supabase
    .from('topics')
    .insert([params])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get all topics
export async function getAllTopics(): Promise<Topic[]> {
  const { data, error } = await supabase
    .from('topics')
    .select()
    .order('name');

  if (error) throw error;
  return data;
}

// Get topic by ID
export async function getTopicById(id: string): Promise<Topic | null> {
  const { data, error } = await supabase
    .from('topics')
    .select()
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Get topics by category
export async function getTopicsByCategory(category: string): Promise<Topic[]> {
  const { data, error } = await supabase
    .from('topics')
    .select()
    .eq('category', category)
    .order('name');

  if (error) throw error;
  return data;
}

// Update topic
export async function updateTopic(id: string, params: UpdateTopicParams): Promise<Topic> {
  const { data, error } = await supabase
    .from('topics')
    .update(params)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete topic
export async function deleteTopic(id: string): Promise<void> {
  const { error } = await supabase
    .from('topics')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 