
-- Create functions for interaction with the community forum database

-- Get all forum posts
CREATE OR REPLACE FUNCTION public.get_forum_posts()
RETURNS SETOF JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT row_to_json(p)
  FROM (
    SELECT 
      cp.*,
      (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = cp.id) as likes,
      json_build_object(
        'id', u.id,
        'email', u.email,
        'name', u.name,
        'full_name', u.full_name,
        'avatar_url', u.avatar_url
      ) as user,
      (
        SELECT COALESCE(json_agg(c), '[]'::json)
        FROM (
          SELECT 
            pc.*,
            json_build_object(
              'id', cu.id,
              'email', cu.email,
              'name', cu.name,
              'full_name', cu.full_name,
              'avatar_url', cu.avatar_url
            ) as user
          FROM post_comments pc
          LEFT JOIN users cu ON pc.user_id = cu.id
          WHERE pc.post_id = cp.id AND pc.approved = TRUE
          ORDER BY pc.created_at ASC
        ) c
      ) as comments
    FROM community_posts cp
    LEFT JOIN users u ON cp.user_id = u.id
    WHERE cp.approved = TRUE OR cp.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
    ORDER BY cp.created_at DESC
  ) p;
END;
$$;

-- Create forum post
CREATE OR REPLACE FUNCTION public.create_forum_post(
  title_param TEXT,
  content_param TEXT,
  category_id_param TEXT,
  media_param JSONB DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin BOOLEAN;
  new_post_id UUID;
  post_record JSON;
BEGIN
  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) INTO is_admin;

  -- Create the post
  INSERT INTO community_posts (
    user_id,
    title,
    content,
    category_id,
    approved,
    media
  )
  VALUES (
    auth.uid(),
    title_param,
    content_param,
    category_id_param,
    is_admin, -- Auto-approve if admin
    media_param
  )
  RETURNING id INTO new_post_id;
  
  -- Get the post with all its details
  SELECT row_to_json(p)
  INTO post_record
  FROM (
    SELECT 
      cp.*,
      0 as likes,
      json_build_object(
        'id', u.id,
        'email', u.email,
        'name', u.name,
        'full_name', u.full_name,
        'avatar_url', u.avatar_url
      ) as user,
      '[]'::json as comments
    FROM community_posts cp
    LEFT JOIN users u ON cp.user_id = u.id
    WHERE cp.id = new_post_id
  ) p;
  
  RETURN post_record;
END;
$$;

-- Approve forum post
CREATE OR REPLACE FUNCTION public.approve_forum_post(
  post_id_param UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) INTO is_admin;
  
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Only administrators can approve posts';
  END IF;

  -- Approve the post
  UPDATE community_posts
  SET approved = TRUE
  WHERE id = post_id_param;
  
  RETURN TRUE;
END;
$$;

-- Delete forum post
CREATE OR REPLACE FUNCTION public.delete_forum_post(
  post_id_param UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin BOOLEAN;
  is_owner BOOLEAN;
BEGIN
  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) INTO is_admin;
  
  -- Check if user is the post owner
  SELECT EXISTS (
    SELECT 1 FROM community_posts
    WHERE id = post_id_param AND user_id = auth.uid()
  ) INTO is_owner;
  
  IF NOT is_admin AND NOT is_owner THEN
    RAISE EXCEPTION 'You do not have permission to delete this post';
  END IF;

  -- Delete all likes for this post
  DELETE FROM post_likes
  WHERE post_id = post_id_param;
  
  -- Delete all comments for this post
  DELETE FROM post_comments
  WHERE post_id = post_id_param;
  
  -- Delete all bookmarks for this post
  DELETE FROM bookmarks
  WHERE content_id = post_id_param::TEXT AND content_type = 'post';
  
  -- Delete the post
  DELETE FROM community_posts
  WHERE id = post_id_param;
  
  RETURN TRUE;
END;
$$;
