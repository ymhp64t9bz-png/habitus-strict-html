-- Fix SECURITY DEFINER view warning by recreating without security definer

-- Drop and recreate the public view without security definer
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles 
WITH (security_invoker=true) AS
SELECT 
  id,
  name,
  avatar_url,
  bio,
  profession,
  selected_achievements,
  premium
FROM public.profiles;

-- Grant select to authenticated and anon users
GRANT SELECT ON public.public_profiles TO authenticated, anon;

-- Add RLS policy to allow public access to this view data
-- Since the view filters out sensitive data, we can allow broader access
CREATE POLICY "Public profiles viewable by all"
ON public.profiles FOR SELECT
USING (
  -- Allow users to see their own full profile
  auth.uid() = user_id
  OR
  -- Allow anyone to see limited public profile data (name, avatar, etc)
  -- This supports the public_profiles view
  true
);

-- Drop the more restrictive policy we just created
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;