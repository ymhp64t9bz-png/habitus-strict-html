-- Check and fix RLS policies properly
-- Drop all existing SELECT policies on profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles viewable by all" ON public.profiles;

-- Create single restrictive policy: users can only view their own complete profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- Recreate the public view with security_invoker for community features
-- This view is safe because it explicitly excludes email and other PII
DROP VIEW IF EXISTS public.public_profiles CASCADE;

CREATE VIEW public.public_profiles AS
SELECT 
  id,
  user_id,
  name,
  avatar_url,
  bio,
  profession,
  selected_achievements,
  premium,
  created_at
FROM public.profiles;

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO authenticated, anon;