import { createBrowserRouter } from "react-router";

import Landing from "./routes/Landing";
import SetupForm from "./routes/AccountSetUp";
import Home from "./routes/Home";
import TestEmails from "./routes/TestEmails";
import Kanban from "./routes/Kanban";
// import Filter from "./routes/Filter"

const router = createBrowserRouter([
  {
    loader: async ({ params }) => {
      const response = await fetch(`http://localhost:3000/api/projects/${params.projectId}/emails`, {
        credentials: "include",
      });
      const data = await response.json();  // parse JSON body (the emails array)
      return data;
    },
    path: "/projects/:projectId/emails",
    Component: TestEmails,
  },
  { path: "/", Component: Landing },
  { path: "/setup", Component: SetupForm },
  { path: "/projects/:projectId/home", Component: Home },
  { path: "/kanban", Component: Kanban },
  // { path: '/filter', Component: Filter}
]);

export default router;
