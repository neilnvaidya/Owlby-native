-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create learning_sessions table
CREATE TABLE IF NOT EXISTS learning_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  topic VARCHAR(255) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP WITH TIME ZONE,
  points_earned INTEGER DEFAULT 0,
  summary TEXT
);

-- Create interactions table
CREATE TABLE IF NOT EXISTS interactions (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES learning_sessions(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  topic VARCHAR(255),
  difficulty INTEGER,
  tags TEXT[]
);

-- Create deep_learning_content table
CREATE TABLE IF NOT EXISTS deep_learning_content (
  id SERIAL PRIMARY KEY,
  parent_interaction_id INTEGER REFERENCES interactions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  resources JSONB,
  related_topics TEXT[],
  difficulty INTEGER
);

-- Create tests table
CREATE TABLE IF NOT EXISTS tests (
  id SERIAL PRIMARY KEY,
  topic VARCHAR(255) NOT NULL,
  difficulty INTEGER NOT NULL,
  time_limit INTEGER,
  points INTEGER DEFAULT 0
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT
);

-- Create progress table
CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  topic VARCHAR(255) NOT NULL,
  mastery_level INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  completed_tests INTEGER DEFAULT 0,
  UNIQUE(user_id, topic)
);

-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  rewards JSONB,
  achieved BOOLEAN DEFAULT FALSE,
  achieved_at TIMESTAMP WITH TIME ZONE
);

-- Create user_milestones table (for tracking which users have achieved which milestones)
CREATE TABLE IF NOT EXISTS user_milestones (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  milestone_id INTEGER REFERENCES milestones(id) ON DELETE CASCADE,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, milestone_id)
); 