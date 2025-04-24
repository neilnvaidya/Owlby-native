import { supabase } from './config/supabase';
import { logger } from './utils/logger';

async function testDatabaseTables() {
  try {
    logger.info('Testing database tables...');
    
    // Test users table
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (usersError) {
      logger.error('Error accessing users table:', usersError);
    } else {
      logger.info('✅ Users table exists and is accessible');
    }
    
    // Test topics table
    const { data: topicsData, error: topicsError } = await supabase
      .from('topics')
      .select('count')
      .limit(1);
    
    if (topicsError) {
      logger.error('Error accessing topics table:', topicsError);
    } else {
      logger.info('✅ Topics table exists and is accessible');
    }
    
    // Test sessions table
    const { data: sessionsData, error: sessionsError } = await supabase
      .from('sessions')
      .select('count')
      .limit(1);
    
    if (sessionsError) {
      logger.error('Error accessing sessions table:', sessionsError);
    } else {
      logger.info('✅ Sessions table exists and is accessible');
    }
    
    // Test progress table
    const { data: progressData, error: progressError } = await supabase
      .from('progress')
      .select('count')
      .limit(1);
    
    if (progressError) {
      logger.error('Error accessing progress table:', progressError);
    } else {
      logger.info('✅ Progress table exists and is accessible');
    }
    
    // List all tables in the database
    const { data: tablesData, error: tablesError } = await supabase
      .rpc('get_tables');
    
    if (tablesError) {
      logger.error('Error listing tables:', tablesError);
    } else {
      logger.info('Available tables in the database:');
      console.log(tablesData);
    }
    
  } catch (error) {
    logger.error('Unexpected error testing database tables:', error);
  }
}

// Run the test
testDatabaseTables(); 