import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/layout/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Today } from "./pages/Today";
import { AllTasks } from "./pages/AllTasks";
import { Calendar } from "./pages/Calendar";
import { Projects } from "./pages/Projects";
import { Statistics } from "./pages/Statistics";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "today", Component: Today },
      { path: "tasks", Component: AllTasks },
      { path: "calendar", Component: Calendar },
      { path: "projects", Component: Projects },
      { path: "statistics", Component: Statistics },
      { path: "settings", Component: Settings },
    ],
  },
]);
