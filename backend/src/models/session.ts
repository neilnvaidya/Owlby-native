import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

export interface Session {
  id: string;
  user_id: string;
  topic_id: string;
  start_time: Date;
  end_time: Date | null;
  duration: number | null;
  summary: string | null;
  complexity_level: number | null;
  created_at: Date;
}

export interface CreateSessionParams {
  user_id: string;
  topic_id: string;
  start_time: Date;
  complexity_level?: number;
}

export interface UpdateSessionParams {
  end_time?: Date;
  duration?: number;
  summary?: string;
  complexity_level?: number;
}

export async function createSession(params: CreateSessionParams): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions')
    .insert([params])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSessionById(id: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select()
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getSessionsByUserId(userId: string): Promise<Session[]> {
  const { data, error } = await supabase
    .from('sessions')
    .select()
    .eq('user_id', userId)
    .order('start_time', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getActiveSessionByUserId(userId: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select()
    .eq('user_id', userId)
    .is('end_time', null)
    .single();

  if (error) throw error;
  return data;
}

export async function updateSession(id: string, params: UpdateSessionParams): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions')
    .update(params)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function endSession(id: string, summary?: string): Promise<Session> {
  const endTime = new Date();
  const session = await getSessionById(id);
  
  if (!session) {
    throw new Error('Session not found');
  }

  const duration = Math.floor((endTime.getTime() - new Date(session.start_time).getTime()) / 1000);
  
  const { data, error } = await supabase
    .from('sessions')
    .update({
      end_time: endTime,
      duration,
      summary: summary || null
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSession(id: string): Promise<void> {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 