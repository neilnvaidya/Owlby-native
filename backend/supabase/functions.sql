-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT,
  google_id TEXT UNIQUE,
  apple_id TEXT UNIQUE,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create learning_sessions table
CREATE TABLE IF NOT EXISTS learning_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  points_earned INTEGER DEFAULT 0,
  summary TEXT
);

-- Create interactions table
CREATE TABLE IF NOT EXISTS interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES learning_sessions(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  topic TEXT,
  difficulty INTEGER,
  tags TEXT[]
);

-- Create deep_learning_content table
CREATE TABLE IF NOT EXISTS deep_learning_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_interaction_id UUID REFERENCES interactions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  resources JSONB,
  related_topics TEXT[],
  difficulty INTEGER
);

-- Create progress table
CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  mastery_level INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  completed_tests INTEGER DEFAULT 0,
  UNIQUE(user_id, topic)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deep_learning_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Users policies
  DROP POLICY IF EXISTS "Users can view their own data" ON users;
  DROP POLICY IF EXISTS "Users can update their own data" ON users;
  
  -- Learning sessions policies
  DROP POLICY IF EXISTS "Users can view their own sessions" ON learning_sessions;
  DROP POLICY IF EXISTS "Users can create their own sessions" ON learning_sessions;
  DROP POLICY IF EXISTS "Users can update their own sessions" ON learning_sessions;
  
  -- Interactions policies
  DROP POLICY IF EXISTS "Users can view their own interactions" ON interactions;
  DROP POLICY IF EXISTS "Users can create their own interactions" ON interactions;
  
  -- Deep learning content policies
  DROP POLICY IF EXISTS "Users can view their own deep learning content" ON deep_learning_content;
  
  -- Progress policies
  DROP POLICY IF EXISTS "Users can view their own progress" ON progress;
  DROP POLICY IF EXISTS "Users can update their own progress" ON progress;
  DROP POLICY IF EXISTS "Users can create their own progress" ON progress;
END $$;

-- Users policies
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Learning sessions policies
CREATE POLICY "Users can view their own sessions"
  ON learning_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
  ON learning_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON learning_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Interactions policies
CREATE POLICY "Users can view their own interactions"
  ON interactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM learning_sessions
      WHERE learning_sessions.id = interactions.session_id
      AND learning_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own interactions"
  ON interactions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM learning_sessions
      WHERE learning_sessions.id = interactions.session_id
      AND learning_sessions.user_id = auth.uid()
    )
  );

-- Deep learning content policies
CREATE POLICY "Users can view their own deep learning content"
  ON deep_learning_content FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM interactions
      JOIN learning_sessions ON learning_sessions.id = interactions.session_id
      WHERE interactions.id = deep_learning_content.parent_interaction_id
      AND learning_sessions.user_id = auth.uid()
    )
  );

-- Progress policies
CREATE POLICY "Users can view their own progress"
  ON progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress"
  ON progress FOR INSERT
  WITH CHECK (auth.uid() = user_id); 
  