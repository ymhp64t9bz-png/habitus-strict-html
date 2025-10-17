-- Fix security warnings: Add DELETE policy and protect premium field

-- 1. Add DELETE policy for profiles (GDPR compliance)
CREATE POLICY "Users can delete own profile"
ON public.profiles FOR DELETE
USING (auth.uid() = user_id);

-- 2. Drop existing UPDATE policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- 3. Create new UPDATE policy that protects premium field
CREATE POLICY "Users can update profile (not premium)"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND
  -- Prevent users from modifying their premium status directly
  premium = (SELECT premium FROM public.profiles WHERE user_id = auth.uid())
);