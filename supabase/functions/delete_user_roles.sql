
-- Create a function to delete user roles safely
CREATE OR REPLACE FUNCTION public.delete_user_roles(
  user_id_param UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.user_roles
  WHERE user_id = user_id_param;
END;
$$;
