
import React, { Fragment } from "react";
import WelcomeHeader from "@/components/WelcomeHeader";
import CoursesInProgress from "@/components/dashboard/CoursesInProgress";
import PopularCategories from "@/components/dashboard/PopularCategories";
import TopMentors from "@/components/dashboard/TopMentors";

const Dashboard = () => {
  return (
    <Fragment>
      <WelcomeHeader />
      
      <div className="space-y-8">
        <CoursesInProgress />
        <PopularCategories />
        <TopMentors />
      </div>
    </Fragment>
  );
};

export default Dashboard;
