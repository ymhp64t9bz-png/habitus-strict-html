-- Fix PUBLIC_DATA_EXPOSURE: Restrict profile access and create public view

-- Drop the insecure public policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create policy: Users can only view their own complete profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- Create a safe public view for community features (excludes email and other sensitive PII)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  name,
  avatar_url,
  bio,
  profession,
  selected_achievements,
  premium
FROM public.profiles;

-- Allow everyone to view the public profiles view
GRANT SELECT ON public.public_profiles TO authenticated, anon;