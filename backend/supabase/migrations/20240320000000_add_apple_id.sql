-- Add apple_id column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS apple_id TEXT UNIQUE; 