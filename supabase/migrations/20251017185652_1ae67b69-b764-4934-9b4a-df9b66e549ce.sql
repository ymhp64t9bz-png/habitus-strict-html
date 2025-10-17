-- Check and update UPDATE policy to protect premium field

-- Drop existing UPDATE policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update profile (not premium)" ON public.profiles;

-- Create new UPDATE policy that protects premium field from direct user modification
CREATE POLICY "Users can update profile except premium"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND
  -- Ensure premium field cannot be changed by users directly
  premium = (SELECT premium FROM public.profiles WHERE user_id = auth.uid())
);