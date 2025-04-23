
// This is a stub file since we're removing bookmark functionality
export const bookmarkService = {
  getUserBookmarks: async (_userId: string): Promise<string[]> => {
    return [];
  },
  
  addBookmark: async (_userId: string, _courseId: string): Promise<void> => {
    // Stub implementation
  },
  
  removeBookmark: async (_userId: string, _courseId: string): Promise<void> => {
    // Stub implementation
  }
};
