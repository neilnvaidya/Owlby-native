import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

export interface UserLearningProfile {
  id: string;
  user_id: string;
  language_level: number | null;
  math_level: number | null;
  science_level: number | null;
  history_level: number | null;
  preferred_topics: string[] | null;
  challenging_concepts: string[] | null;
  learning_style: string | null;
  attention_span: number | null;
  updated_at: Date;
}

export interface CreateUserLearningProfileParams {
  user_id: string;
  language_level?: number;
  math_level?: number;
  science_level?: number;
  history_level?: number;
  preferred_topics?: string[];
  challenging_concepts?: string[];
  learning_style?: string;
  attention_span?: number;
}

export interface UpdateUserLearningProfileParams {
  language_level?: number;
  math_level?: number;
  science_level?: number;
  history_level?: number;
  preferred_topics?: string[];
  challenging_concepts?: string[];
  learning_style?: string;
  attention_span?: number;
}

// Create a new user learning profile
export async function createUserLearningProfile(params: CreateUserLearningProfileParams): Promise<UserLearningProfile> {
  const { data, error } = await supabase
    .from('user_learning_profiles')
    .insert([{
      user_id: params.user_id,
      language_level: params.language_level || null,
      math_level: params.math_level || null,
      science_level: params.science_level || null,
      history_level: params.history_level || null,
      preferred_topics: params.preferred_topics || null,
      challenging_concepts: params.challenging_concepts || null,
      learning_style: params.learning_style || null,
      attention_span: params.attention_span || null
    }])
    .select()
    .single();

  if (error) {
    logger.error('Error creating user learning profile:', error);
    throw error;
  }
  
  return data;
}

// Get user learning profile by user ID
export async function getUserLearningProfileByUserId(userId: string): Promise<UserLearningProfile | null> {
  const { data, error } = await supabase
    .from('user_learning_profiles')
    .select()
    .eq('user_id', userId)
    .single();

  if (error) {
    logger.error('Error getting user learning profile:', error);
    throw error;
  }
  
  return data;
}

// Update user learning profile
export async function updateUserLearningProfile(userId: string, params: UpdateUserLearningProfileParams): Promise<UserLearningProfile> {
  const { data, error } = await supabase
    .from('user_learning_profiles')
    .update({
      language_level: params.language_level,
      math_level: params.math_level,
      science_level: params.science_level,
      history_level: params.history_level,
      preferred_topics: params.preferred_topics,
      challenging_concepts: params.challenging_concepts,
      learning_style: params.learning_style,
      attention_span: params.attention_span,
      updated_at: new Date()
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    logger.error('Error updating user learning profile:', error);
    throw error;
  }
  
  return data;
}

// Create or update user learning profile
export async function upsertUserLearningProfile(params: CreateUserLearningProfileParams): Promise<UserLearningProfile> {
  const existingProfile = await getUserLearningProfileByUserId(params.user_id);
  
  if (existingProfile) {
    return updateUserLearningProfile(params.user_id, {
      language_level: params.language_level,
      math_level: params.math_level,
      science_level: params.science_level,
      history_level: params.history_level,
      preferred_topics: params.preferred_topics,
      challenging_concepts: params.challenging_concepts,
      learning_style: params.learning_style,
      attention_span: params.attention_span
    });
  } else {
    return createUserLearningProfile(params);
  }
} 