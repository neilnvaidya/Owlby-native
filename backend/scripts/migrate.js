#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    
    // Read the SQL file
    const fs = require('fs');
    const path = require('path');
    const sql = fs.readFileSync(path.join(__dirname, '../supabase/functions.sql'), 'utf8');
    
    // Split the SQL into individual statements
    const statements = sql.split(';').filter(statement => statement.trim());
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.trim().split('\n')[0]}...`);
        const { error } = await supabase.rpc('exec_sql', { query: statement });
        
        if (error) {
          console.error('Error executing statement:', error);
          continue; // Continue with next statement even if one fails
        }
      }
    }
    
    console.log('Migrations completed!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

runMigrations(); 