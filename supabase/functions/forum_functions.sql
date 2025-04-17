
-- Create functions to support the forum operations

-- Toggle post like
CREATE OR REPLACE FUNCTION public.toggle_post_like(
  user_id_param UUID,
  post_id_param UUID,
  like_state_param BOOLEAN
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If like_state_param is true, add the like
  IF like_state_param THEN
    -- Check if like already exists
    IF NOT EXISTS (
      SELECT 1 FROM post_likes 
      WHERE user_id = user_id_param AND post_id = post_id_param
    ) THEN
      -- Insert the like
      INSERT INTO post_likes (user_id, post_id)
      VALUES (user_id_param, post_id_param);
    END IF;
    RETURN TRUE;
  ELSE
    -- Remove the like
    DELETE FROM post_likes
    WHERE user_id = user_id_param AND post_id = post_id_param;
    RETURN FALSE;
  END IF;
END;
$$;

-- Check if post is liked
CREATE OR REPLACE FUNCTION public.get_post_like(
  user_id_param UUID,
  post_id_param UUID
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  like_record JSON;
BEGIN
  SELECT row_to_json(pl)
  INTO like_record
  FROM post_likes pl
  WHERE user_id = user_id_param AND post_id = post_id_param;
  
  RETURN like_record;
END;
$$;

-- Add comment
CREATE OR REPLACE FUNCTION public.add_comment(
  post_id_param UUID,
  user_id_param UUID,
  content_param TEXT
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_comment_id UUID;
  comment_record JSON;
BEGIN
  -- Insert the comment
  INSERT INTO post_comments (post_id, user_id, content, approved)
  VALUES (post_id_param, user_id_param, content_param, TRUE)
  RETURNING id INTO new_comment_id;
  
  -- Get the comment with user details
  SELECT row_to_json(c)
  INTO comment_record
  FROM (
    SELECT 
      pc.*,
      json_build_object(
        'id', u.id,
        'email', u.email,
        'name', u.name,
        'full_name', u.full_name,
        'avatar_url', u.avatar_url
      ) as user
    FROM post_comments pc
    LEFT JOIN users u ON pc.user_id = u.id
    WHERE pc.id = new_comment_id
  ) c;
  
  RETURN comment_record;
END;
$$;

-- Get post comments
CREATE OR REPLACE FUNCTION public.get_post_comments(
  post_id_param UUID
) RETURNS SETOF JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT row_to_json(c)
  FROM (
    SELECT 
      pc.*,
      json_build_object(
        'id', u.id,
        'email', u.email,
        'name', u.name,
        'full_name', u.full_name,
        'avatar_url', u.avatar_url
      ) as user
    FROM post_comments pc
    LEFT JOIN users u ON pc.user_id = u.id
    WHERE pc.post_id = post_id_param AND pc.approved = TRUE
    ORDER BY pc.created_at ASC
  ) c;
END;
$$;

-- Toggle bookmark
CREATE OR REPLACE FUNCTION public.toggle_bookmark(
  user_id_param UUID,
  content_id_param TEXT,
  content_type_param TEXT,
  title_param TEXT,
  description_param TEXT DEFAULT NULL,
  thumbnail_param TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if bookmark already exists
  IF EXISTS (
    SELECT 1 FROM bookmarks 
    WHERE user_id = user_id_param 
    AND content_id = content_id_param 
    AND content_type = content_type_param
  ) THEN
    -- Remove bookmark
    DELETE FROM bookmarks
    WHERE user_id = user_id_param 
    AND content_id = content_id_param 
    AND content_type = content_type_param;
    
    RETURN FALSE;
  ELSE
    -- Add bookmark
    INSERT INTO bookmarks (
      user_id, 
      content_id, 
      content_type, 
      title, 
      description,
      thumbnail
    )
    VALUES (
      user_id_param,
      content_id_param,
      content_type_param,
      title_param,
      description_param,
      thumbnail_param
    );
    
    RETURN TRUE;
  END IF;
END;
$$;

-- Check bookmark
CREATE OR REPLACE FUNCTION public.check_bookmark(
  user_id_param UUID,
  content_id_param TEXT,
  content_type_param TEXT
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  bookmark_record JSON;
BEGIN
  SELECT row_to_json(b)
  INTO bookmark_record
  FROM bookmarks b
  WHERE user_id = user_id_param 
  AND content_id = content_id_param 
  AND content_type = content_type_param;
  
  RETURN bookmark_record;
END;
$$;

-- Get bookmark
CREATE OR REPLACE FUNCTION public.get_bookmark(
  user_id_param UUID,
  content_id_param TEXT,
  content_type_param TEXT
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  bookmark_record JSON;
BEGIN
  SELECT row_to_json(b)
  INTO bookmark_record
  FROM bookmarks b
  WHERE user_id = user_id_param 
  AND content_id = content_id_param 
  AND content_type = content_type_param;
  
  RETURN bookmark_record;
END;
$$;

-- Get user bookmarks
CREATE OR REPLACE FUNCTION public.get_user_bookmarks(
) RETURNS SETOF bookmarks
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM bookmarks
  WHERE user_id = auth.uid()
  ORDER BY created_at DESC;
$$;

-- Get user notes
CREATE OR REPLACE FUNCTION public.get_user_notes(
) RETURNS SETOF notes
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM notes
  WHERE user_id = auth.uid()
  ORDER BY updated_at DESC;
$$;

-- Update note
CREATE OR REPLACE FUNCTION public.update_note(
  lesson_id_param TEXT,
  course_id_param TEXT,
  content_param TEXT,
  user_id_param UUID
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  note_id UUID;
  note_record JSON;
BEGIN
  -- Check if note already exists
  SELECT id INTO note_id
  FROM notes
  WHERE user_id = user_id_param 
  AND lesson_id = lesson_id_param 
  AND course_id = course_id_param;
  
  IF note_id IS NULL THEN
    -- Insert new note
    INSERT INTO notes (
      user_id,
      lesson_id,
      course_id,
      content,
      updated_at
    )
    VALUES (
      user_id_param,
      lesson_id_param,
      course_id_param,
      content_param,
      now()
    )
    RETURNING id INTO note_id;
  ELSE
    -- Update existing note
    UPDATE notes
    SET content = content_param,
        updated_at = now()
    WHERE id = note_id;
  END IF;
  
  -- Get the note details
  SELECT row_to_json(n)
  INTO note_record
  FROM notes n
  WHERE n.id = note_id;
  
  RETURN note_record;
END;
$$;

-- Delete note
CREATE OR REPLACE FUNCTION public.delete_note(
  note_id_param UUID,
  user_id_param UUID
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM notes
  WHERE id = note_id_param AND user_id = user_id_param;
END;
$$;
