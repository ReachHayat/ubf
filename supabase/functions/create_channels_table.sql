
-- Create a function to create the channels table
CREATE OR REPLACE FUNCTION public.create_channels_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if table exists
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_tables 
    WHERE schemaname = 'public' AND tablename = 'channels') THEN
    
    -- Create the channels table
    CREATE TABLE public.channels (
      id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'text',
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      created_by UUID REFERENCES auth.users(id)
    );

    -- Enable RLS on the channels table
    ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

    -- Create policy for selecting channels
    CREATE POLICY "Anyone can view channels" 
      ON public.channels 
      FOR SELECT 
      USING (true);

    -- Create policy for inserting channels - only admins
    CREATE POLICY "Only admins can create channels" 
      ON public.channels 
      FOR INSERT 
      WITH CHECK (public.is_admin(auth.uid()));

    -- Create policy for updating channels - only admins
    CREATE POLICY "Only admins can update channels" 
      ON public.channels 
      FOR UPDATE 
      USING (public.is_admin(auth.uid()));

    -- Create policy for deleting channels - only admins
    CREATE POLICY "Only admins can delete channels" 
      ON public.channels 
      FOR DELETE 
      USING (public.is_admin(auth.uid()));

    -- Insert some default channels
    INSERT INTO public.channels (name, type)
    VALUES 
      ('general', 'text'),
      ('help', 'text'),
      ('angular', 'text'),
      ('ui-ux', 'text'),
      ('jobs', 'text');
  END IF;
END;
$$;
