import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

async function checkUsersTable() {
  try {
    logger.info('Checking users table structure...');
    
    // Get a sample user to see the structure
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) {
      logger.error('Error accessing users table:', error);
      return;
    }
    
    if (data && data.length > 0) {
      logger.info('Users table structure:');
      console.log(JSON.stringify(data[0], null, 2));
      
      // Check if all required fields exist
      const requiredFields = ['id', 'google_id', 'email', 'name', 'created_at', 'updated_at'];
      const missingFields = requiredFields.filter(field => !(field in data[0]));
      
      if (missingFields.length > 0) {
        logger.warn(`Missing fields in users table: ${missingFields.join(', ')}`);
      } else {
        logger.info('✅ All required fields exist in users table');
      }
      
      // Check field types
      logger.info('Field types:');
      for (const [key, value] of Object.entries(data[0])) {
        logger.info(`${key}: ${typeof value}`);
      }
    } else {
      logger.info('Users table exists but is empty');
    }
    
  } catch (error) {
    logger.error('Unexpected error checking users table:', error);
  }
}

// Run the check
checkUsersTable(); 