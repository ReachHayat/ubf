
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Course } from "@/types/course";

// Since we're removing bookmarks functionality, this is a stub implementation
export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  
  const addBookmark = async (_courseId: string): Promise<void> => {
    // Stub implementation
  };
  
  const removeBookmark = async (_courseId: string): Promise<void> => {
    // Stub implementation
  };
  
  const isBookmarked = (_courseId: string): boolean => {
    return false;
  };
  
  return {
    bookmarks,
    loading,
    addBookmark,
    removeBookmark,
    isBookmarked
  };
};
