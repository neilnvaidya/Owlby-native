import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

async function updateUsersTable() {
  try {
    logger.info('Updating users table structure...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '..', 'supabase', 'update-users-table.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim() !== '');
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim() === '') continue;
      
      logger.info(`Executing SQL: ${statement.substring(0, 50)}...`);
      
      const { error } = await supabase.rpc('exec_sql', {
        sql: statement
      });
      
      if (error) {
        logger.error(`Error executing SQL: ${error.message}`);
        logger.error(`Statement: ${statement}`);
      } else {
        logger.info('✅ SQL executed successfully');
      }
    }
    
    logger.info('Users table update completed!');
    
    // Check the updated table structure
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) {
      logger.error('Error checking updated users table:', error);
    } else if (data && data.length > 0) {
      logger.info('Updated users table structure:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      logger.info('Users table exists but is empty');
    }
    
  } catch (error) {
    logger.error('Unexpected error updating users table:', error);
  }
}

// Run the update
updateUsersTable(); 