import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

async function runMigrations() {
  try {
    logger.info('Running database migrations...');
    
    // Check if tables exist and create them if they don't
    const tables = ['users', 'topics', 'sessions', 'progress'];
    
    for (const table of tables) {
      try {
        // Try to query the table to see if it exists
        const { error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          // Table doesn't exist, create it
          logger.info(`Table '${table}' doesn't exist. Creating it...`);
          
          let createTableSQL = '';
          
          switch (table) {
            case 'users':
              createTableSQL = `
                CREATE TABLE IF NOT EXISTS users (
                  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                  google_id TEXT UNIQUE NOT NULL,
                  email TEXT UNIQUE NOT NULL,
                  name TEXT NOT NULL,
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
              `;
              break;
            case 'topics':
              createTableSQL = `
                CREATE TABLE IF NOT EXISTS topics (
                  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                  name TEXT NOT NULL,
                  category TEXT NOT NULL,
                  description TEXT,
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
              `;
              break;
            case 'sessions':
              createTableSQL = `
                CREATE TABLE IF NOT EXISTS sessions (
                  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
                  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
                  end_time TIMESTAMP WITH TIME ZONE,
                  duration INTEGER,
                  summary TEXT,
                  complexity_level INTEGER,
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
              `;
              break;
            case 'progress':
              createTableSQL = `
                CREATE TABLE IF NOT EXISTS progress (
                  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
                  proficiency_level INTEGER NOT NULL DEFAULT 1,
                  last_session_date TIMESTAMP WITH TIME ZONE,
                  total_sessions INTEGER NOT NULL DEFAULT 0,
                  total_duration INTEGER NOT NULL DEFAULT 0,
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                  UNIQUE(user_id, topic_id)
                );
              `;
              break;
          }
          
          // Execute the SQL to create the table
          const { error: createError } = await supabase.rpc('exec_sql', {
            sql: createTableSQL
          });
          
          if (createError) {
            logger.error(`Error creating ${table} table:`, createError);
          } else {
            logger.info(`✅ ${table} table created successfully`);
          }
        } else {
          logger.info(`✅ ${table} table already exists`);
        }
      } catch (error) {
        logger.error(`Error checking/creating ${table} table:`, error);
      }
    }
    
    logger.info('Migrations completed!');
    
  } catch (error) {
    logger.error('Unexpected error during migrations:', error);
  }
}

// Run migrations
runMigrations(); 