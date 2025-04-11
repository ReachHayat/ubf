
-- Create a function to create the users_online table
CREATE OR REPLACE FUNCTION public.create_users_online_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if table exists
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_tables 
    WHERE schemaname = 'public' AND tablename = 'users_online') THEN
    
    -- Create the users_online view
    CREATE VIEW public.users_online AS
    SELECT
      au.id,
      au.email,
      au.raw_user_meta_data->>'full_name' as name,
      CASE 
        WHEN ur.role = 'admin' THEN 'Admin'
        WHEN ur.role = 'tutor' THEN 'Tutor'
        ELSE 'Student'
      END as role,
      SUBSTRING(au.raw_user_meta_data->>'full_name', 1, 1) || 
        COALESCE(SUBSTRING(au.raw_user_meta_data->>'full_name', POSITION(' ' IN au.raw_user_meta_data->>'full_name') + 1, 1), '') as avatar,
      TRUE as online
    FROM auth.users au
    LEFT JOIN public.user_roles ur ON au.id = ur.user_id
    -- In a real app, you would track actual online status
    LIMIT 5;
    
    -- Since this is a VIEW, we don't need RLS policies directly on it
    -- Instead, make sure the underlying tables have appropriate policies
  END IF;
END;
$$;
