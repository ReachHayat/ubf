
export const courseNotesService = {
  getUserNotes: async (userId: string, lessonId: string, courseId: string): Promise<string> => {
    return "";
  },
  
  updateUserNotes: async (userId: string, lessonId: string, courseId: string, content: string): Promise<void> => {
    // Stub implementation
  },
  
  deleteUserNotes: async (userId: string, lessonId: string, courseId: string): Promise<void> => {
    // Stub implementation
  },
  
  // Add missing function
  getAllUserNotes: async (userId: string): Promise<{ lessonId: string, courseId: string, content: string, updatedAt: string }[]> => {
    return [];
  }
};
