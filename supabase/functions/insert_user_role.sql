
-- Create a function to insert a user role safely
CREATE OR REPLACE FUNCTION public.insert_user_role(
  user_id_param UUID,
  role_param user_role
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_id_param, role_param);
END;
$$;
