import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

export interface SessionLearningInsights {
  id: string;
  session_id: string;
  user_id: string;
  topics_covered: string[] | null;
  concepts_mastered: string[] | null;
  concepts_needing_review: string[] | null;
  language_complexity: number | null;
  engagement_level: number | null;
  created_at: Date;
}

export interface CreateSessionLearningInsightsParams {
  session_id: string;
  user_id: string;
  topics_covered?: string[];
  concepts_mastered?: string[];
  concepts_needing_review?: string[];
  language_complexity?: number;
  engagement_level?: number;
}

// Create session learning insights
export async function createSessionLearningInsights(params: CreateSessionLearningInsightsParams): Promise<SessionLearningInsights> {
  const { data, error } = await supabase
    .from('session_learning_insights')
    .insert([{
      session_id: params.session_id,
      user_id: params.user_id,
      topics_covered: params.topics_covered || null,
      concepts_mastered: params.concepts_mastered || null,
      concepts_needing_review: params.concepts_needing_review || null,
      language_complexity: params.language_complexity || null,
      engagement_level: params.engagement_level || null
    }])
    .select()
    .single();

  if (error) {
    logger.error('Error creating session learning insights:', error);
    throw error;
  }
  
  return data;
}

// Get session learning insights by session ID
export async function getSessionLearningInsightsBySessionId(sessionId: string): Promise<SessionLearningInsights | null> {
  const { data, error } = await supabase
    .from('session_learning_insights')
    .select()
    .eq('session_id', sessionId)
    .single();

  if (error) {
    logger.error('Error getting session learning insights:', error);
    throw error;
  }
  
  return data;
}

// Get session learning insights by user ID
export async function getSessionLearningInsightsByUserId(userId: string): Promise<SessionLearningInsights[]> {
  const { data, error } = await supabase
    .from('session_learning_insights')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Error getting session learning insights:', error);
    throw error;
  }
  
  return data || [];
}

// Update user learning profile based on session insights
export async function updateUserProfileFromSessionInsights(
  userId: string, 
  insights: SessionLearningInsights
): Promise<void> {
  try {
    // Get current user profile
    const currentProfile = await import('./user-learning-profile').then(
      module => module.getUserLearningProfileByUserId(userId)
    );
    
    if (!currentProfile) {
      // Create a new profile if none exists
      await import('./user-learning-profile').then(module => 
        module.createUserLearningProfile({
          user_id: userId,
          language_level: insights.language_complexity || undefined,
          preferred_topics: insights.topics_covered || undefined,
          challenging_concepts: insights.concepts_needing_review || undefined
        })
      );
      return;
    }
    
    // Update profile based on insights
    const updatedProfile = {
      language_level: insights.language_complexity || undefined,
      preferred_topics: insights.topics_covered || undefined,
      challenging_concepts: insights.concepts_needing_review || undefined
    };
    
    await import('./user-learning-profile').then(module => 
      module.updateUserLearningProfile(userId, updatedProfile)
    );
  } catch (error) {
    logger.error('Error updating user profile from session insights:', error);
    throw error;
  }
} 