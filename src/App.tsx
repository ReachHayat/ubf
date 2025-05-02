
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Home } from "@/pages/Home";
import Courses from "@/pages/Courses";
import CourseContent from "@/pages/CourseContent";
import CoursePreview from "@/pages/CoursePreview";
import { AuthProvider } from '@/contexts/AuthContext';
import Auth from '@/pages/Auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Assignments from '@/pages/Assignments';
import Admin from '@/pages/Admin';
import Lessons from '@/pages/Lessons';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/preview/:courseId" element={<CoursePreview />} />
              <Route path="/course/:courseId/:lessonId?" element={<CourseContent />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/lessons" element={<Lessons />} />
            </Route>
          </Route>
          
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin/*" element={<Admin />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
