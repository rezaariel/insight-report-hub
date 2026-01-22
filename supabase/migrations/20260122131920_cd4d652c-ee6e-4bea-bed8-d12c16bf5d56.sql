-- Insert default admin account
-- Password: admin123 (hashed by Supabase Auth when user logs in first time)
-- We'll create the user via auth.users and then set up profile and role

-- First, let's create a function to set up the initial admin
-- This will be called after the admin signs up for the first time
CREATE OR REPLACE FUNCTION public.setup_initial_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_exists boolean;
BEGIN
  -- Check if any admin exists
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  ) INTO admin_exists;
  
  -- If no admin exists, we'll set up via trigger on first signup
  IF NOT admin_exists THEN
    RAISE NOTICE 'No admin exists yet. First user with admin@silapor.com will be admin.';
  END IF;
END;
$$;

-- Create a trigger function to auto-assign admin role for specific email
CREATE OR REPLACE FUNCTION public.handle_admin_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If user email is admin@silapor.com, make them admin
  IF NEW.email = 'admin@silapor.com' THEN
    UPDATE public.user_roles 
    SET role = 'admin' 
    WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS on_profile_created_check_admin ON public.profiles;
CREATE TRIGGER on_profile_created_check_admin
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_admin_email();