-- Add apple_id column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS apple_id TEXT UNIQUE;

-- Create index for apple_id
CREATE INDEX IF NOT EXISTS idx_users_apple_id ON public.users(apple_id); 