-- Users table (already implemented)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  google_id TEXT UNIQUE,
  email TEXT UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Topics table (already implemented)
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table (already implemented)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in seconds
  summary TEXT,
  complexity_level INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Paths table
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  name TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Nodes table
CREATE TABLE IF NOT EXISTS learning_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES learning_nodes(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'standard', 'deep_dive', 'test', 'practice'
  content_summary TEXT, -- Brief summary of the content (for privacy)
  complexity_level INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Learning Profile table
CREATE TABLE IF NOT EXISTS user_learning_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  language_level INTEGER, -- 1-10 scale
  math_level INTEGER, -- 1-10 scale
  science_level INTEGER, -- 1-10 scale
  history_level INTEGER, -- 1-10 scale
  preferred_topics TEXT[], -- Array of topic IDs
  challenging_concepts TEXT[], -- Array of concept names
  learning_style TEXT, -- 'visual', 'auditory', 'reading', 'kinesthetic'
  attention_span INTEGER, -- Average attention span in minutes
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session Learning Insights table
CREATE TABLE IF NOT EXISTS session_learning_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topics_covered TEXT[], -- Array of topic IDs
  concepts_mastered TEXT[], -- Array of concept names
  concepts_needing_review TEXT[], -- Array of concept names
  language_complexity INTEGER, -- 1-10 scale
  engagement_level INTEGER, -- 1-10 scale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
); 