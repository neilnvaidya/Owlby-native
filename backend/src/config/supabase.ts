import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from root directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

// Create Supabase client with optimized settings for serverless
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false, // Disable session persistence in serverless
    detectSessionInUrl: false, // Disable session detection in serverless
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'owlby-native',
      'x-application-version': process.env.npm_package_version || '1.0.0',
    },
  },
});

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

// Connection pool management for serverless
let connectionPool: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!connectionPool) {
    connectionPool = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }
  return connectionPool;
}; 