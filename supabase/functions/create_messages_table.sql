
-- Create a function to create the messages table
CREATE OR REPLACE FUNCTION public.create_messages_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if table exists
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_tables 
    WHERE schemaname = 'public' AND tablename = 'messages') THEN
    
    -- Create the messages table
    CREATE TABLE public.messages (
      id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      attachments TEXT[] DEFAULT '{}',
      reactions JSONB DEFAULT '[]',
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    );

    -- Enable RLS on the messages table
    ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

    -- Create policy for selecting messages
    CREATE POLICY "Anyone can view messages" 
      ON public.messages 
      FOR SELECT 
      USING (true);

    -- Create policy for inserting messages - authenticated users only
    CREATE POLICY "Authenticated users can create messages" 
      ON public.messages 
      FOR INSERT 
      WITH CHECK (auth.role() = 'authenticated');

    -- Create policy for updating messages - only message authors or admins
    CREATE POLICY "Users can update their own messages or admins can update any" 
      ON public.messages 
      FOR UPDATE 
      USING ((auth.uid() = user_id) OR public.is_admin(auth.uid()));

    -- Create policy for deleting messages - only message authors or admins
    CREATE POLICY "Users can delete their own messages or admins can delete any" 
      ON public.messages 
      FOR DELETE 
      USING ((auth.uid() = user_id) OR public.is_admin(auth.uid()));
      
    -- Enable realtime for this table
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
    ALTER TABLE public.messages REPLICA IDENTITY FULL;
  END IF;
END;
$$;
