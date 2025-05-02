import { supabase } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  google_id?: string;
  apple_id?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserParams {
  email: string;
  name: string;
  password?: string;
  google_id?: string;
  apple_id?: string;
  avatar?: string;
}

export interface UpdateUserParams {
  name?: string;
  avatar?: string;
}

// Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      logger.error('Error getting user by ID:', error);
      return null;
    }

    return data as User;
  } catch (error) {
    logger.error('Error getting user by ID:', error);
    return null;
  }
};

// Get user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      logger.error('Error getting user by email:', error);
      return null;
    }

    return data as User;
  } catch (error) {
    logger.error('Error getting user by email:', error);
    return null;
  }
};

// Get user by Google ID
export const getUserByGoogleId = async (googleId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('google_id', googleId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      logger.error('Error getting user by Google ID:', error);
      return null;
    }

    return data as User;
  } catch (error) {
    logger.error('Error getting user by Google ID:', error);
    return null;
  }
};

// Get user by Apple ID
export const getUserByAppleId = async (appleId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('apple_id', appleId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      logger.error('Error getting user by Apple ID:', error);
      return null;
    }

    return data as User;
  } catch (error) {
    logger.error('Error getting user by Apple ID:', error);
    return null;
  }
};

// Create user
export const createUser = async (params: CreateUserParams): Promise<User> => {
  try {
    const id = uuidv4();
    const now = new Date().toISOString();

    const newUser = {
      id,
      email: params.email,
      name: params.name,
      password: params.password,
      google_id: params.google_id,
      apple_id: params.apple_id,
      avatar: params.avatar,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from('users')
      .insert([newUser])
      .select()
      .single();

    if (error) {
      logger.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }

    return data as User;
  } catch (error) {
    logger.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};

// Update user
export const updateUser = async (id: string, updates: UpdateUserParams): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating user:', error);
      return null;
    }

    return data as User;
  } catch (error) {
    logger.error('Error updating user:', error);
    return null;
  }
};

// Delete user
export const deleteUser = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  } catch (error) {
    logger.error('Error deleting user:', error);
    throw error;
  }
}; 