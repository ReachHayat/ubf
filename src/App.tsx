import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Home } from "@/pages/Home";
import { Courses } from "@/pages/Courses";
import CourseContent from "@/pages/CourseContent";

const App = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:courseId/:lessonId?" element={<CourseContent />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
