import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';

async function checkSchema() {
  try {
    // Get the table information
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (error) {
      logger.error('Error checking schema:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('Users table columns:', Object.keys(data[0]));
    } else {
      console.log('No data in users table, but table exists');
    }
  } catch (error) {
    logger.error('Unexpected error:', error);
  }
}

checkSchema(); 