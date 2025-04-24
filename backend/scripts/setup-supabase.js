#!/usr/bin/env node

/**
 * This script helps you set up your Supabase project and get the connection details.
 * 
 * Instructions:
 * 1. Go to https://supabase.com/dashboard
 * 2. Create a new project or select an existing one
 * 3. Go to Project Settings > Database
 * 4. Find the connection details and update your .env file
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Supabase Setup Helper ===');
console.log('This script will help you set up your Supabase connection.');
console.log('Please follow the instructions to get your connection details from the Supabase dashboard.');
console.log('');

const questions = [
  {
    name: 'DATABASE_URL',
    question: 'Enter your Supabase database connection string (e.g., postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres): '
  },
  {
    name: 'SUPABASE_URL',
    question: 'Enter your Supabase URL (e.g., https://your-project-ref.supabase.co): '
  },
  {
    name: 'SUPABASE_KEY',
    question: 'Enter your Supabase anon/public key: '
  },
  {
    name: 'SUPABASE_SERVICE_KEY',
    question: 'Enter your Supabase service_role key (optional): '
  }
];

const answers = {};

function askQuestion(index) {
  if (index >= questions.length) {
    createEnvFile();
    return;
  }

  const q = questions[index];
  rl.question(q.question, (answer) => {
    answers[q.name] = answer;
    askQuestion(index + 1);
  });
}

function createEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  
  let envContent = `# Supabase Configuration
DATABASE_URL=${answers.DATABASE_URL}
SUPABASE_URL=${answers.SUPABASE_URL}
SUPABASE_KEY=${answers.SUPABASE_KEY}
${answers.SUPABASE_SERVICE_KEY ? `SUPABASE_SERVICE_KEY=${answers.SUPABASE_SERVICE_KEY}` : ''}

# Server Configuration
PORT=3000
NODE_ENV=development
`;

  fs.writeFileSync(envPath, envContent);
  console.log('');
  console.log(`✅ .env file created at ${envPath}`);
  console.log('');
  console.log('Next steps:');
  console.log('1. Run your database migrations: npm run migrate');
  console.log('2. Start your server: npm run dev');
  
  rl.close();
}

askQuestion(0); 