import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://oxqiqvyxrcrqufwdovrv.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'your-supabase-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      throw error;
    }
    
    console.log('Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    throw error;
  }
}; 