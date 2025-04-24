-- Update users table structure
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Rename display_name to name if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'display_name'
  ) THEN
    ALTER TABLE public.users RENAME COLUMN display_name TO name;
  END IF;
END $$;

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;

-- Create the trigger
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policy for users table if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own data
CREATE POLICY IF NOT EXISTS "Users can view their own data" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

-- Create policy for users to update their own data
CREATE POLICY IF NOT EXISTS "Users can update their own data" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id); 