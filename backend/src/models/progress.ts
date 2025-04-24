import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

export interface Progress {
  id: string;
  user_id: string;
  topic_id: string;
  proficiency_level: number;
  last_session_date: Date;
  total_sessions: number;
  total_duration: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProgressParams {
  user_id: string;
  topic_id: string;
  proficiency_level: number;
}

export interface UpdateProgressParams {
  proficiency_level?: number;
  last_session_date?: Date;
  total_sessions?: number;
  total_duration?: number;
}

export interface TopicProficiency {
  topic_id: string;
  name: string;
  proficiency_level: number;
}

export async function createProgress(params: CreateProgressParams): Promise<Progress> {
  const { data, error } = await supabase
    .from('progress')
    .insert([{
      ...params,
      total_sessions: 1,
      total_duration: 0,
      last_session_date: new Date()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProgressById(id: string): Promise<Progress | null> {
  const { data, error } = await supabase
    .from('progress')
    .select()
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getProgressByUserAndTopic(userId: string, topicId: string): Promise<Progress | null> {
  const { data, error } = await supabase
    .from('progress')
    .select()
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserProgress(userId: string): Promise<Progress[]> {
  const { data, error } = await supabase
    .from('progress')
    .select()
    .eq('user_id', userId)
    .order('last_session_date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateProgress(id: string, params: UpdateProgressParams): Promise<Progress> {
  const { data, error } = await supabase
    .from('progress')
    .update({
      ...params,
      updated_at: new Date()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProgress(id: string): Promise<void> {
  const { error } = await supabase
    .from('progress')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getUserTopicProficiency(userId: string): Promise<TopicProficiency[]> {
  const { data, error } = await supabase
    .from('progress')
    .select(`
      topic_id,
      proficiency_level,
      topics (
        name
      )
    `)
    .eq('user_id', userId)
    .order('proficiency_level', { ascending: false });

  if (error) throw error;

  return data.map((row: any) => ({
    topic_id: row.topic_id,
    name: row.topics.name,
    proficiency_level: row.proficiency_level
  }));
} 