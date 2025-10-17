-- Fix Security Definer View warning
-- Recreate public_profiles view with SECURITY INVOKER

DROP VIEW IF EXISTS public.public_profiles CASCADE;

-- Create view with SECURITY INVOKER (executes with permissions of the user calling it)
-- This is safer as it respects RLS policies of the calling user
CREATE VIEW public.public_profiles 
WITH (security_invoker=true) AS
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

-- Add comment explaining the view's purpose
COMMENT ON VIEW public.public_profiles IS 
'Public-safe view of user profiles that excludes sensitive PII like email addresses. Uses security_invoker to respect caller RLS policies.';