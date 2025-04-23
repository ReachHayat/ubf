
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { bookmarkService } from '@/services/bookmarkService';
import { BookmarkItem } from '@/types/course';

export const useBookmarks = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    } else {
      setBookmarks([]);
    }
  }, [user]);

  const fetchBookmarks = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const bookmarkIds = await bookmarkService.getUserBookmarks(user.id);
      // Since we're removing bookmark functionality, we'll just return an empty array
      setBookmarks([]);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (contentId: string) => {
    if (!user) return;
    
    try {
      await bookmarkService.addBookmark(user.id, contentId);
      await fetchBookmarks();
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const removeBookmark = async (contentId: string) => {
    if (!user) return;
    
    try {
      await bookmarkService.removeBookmark(user.id, contentId);
      await fetchBookmarks();
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const isBookmarked = (contentId: string, contentType: string = 'course') => {
    return bookmarks.some(
      bookmark => bookmark.content_id === contentId && bookmark.content_type === contentType
    );
  };

  const toggleBookmark = async (
    contentId: string, 
    contentType: string, 
    title: string, 
    description: string, 
    thumbnail?: string
  ) => {
    if (!user) return false;
    
    try {
      return await bookmarkService.toggleBookmark(contentId, contentType, title, description, thumbnail);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      return false;
    }
  };

  return {
    bookmarks,
    loading,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark
  };
};
