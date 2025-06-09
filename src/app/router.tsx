import { createBrowserRouter } from "react-router";

import Landing from "./routes/Landing";
import SetupForm from "./routes/AccountSetUp";
import Home from "./routes/Home";
import TestEmails from "./routes/TestEmails";
import Kanban from "./routes/Kanban";
import ViewEmail from "./routes/ViewEmail";
// import Filter from "./routes/Filter"

const router = createBrowserRouter([
  {
    loader: async () => {
      const response = await fetch("http://localhost:3000/getemails");
      console.log(response.status);
      return response.json();
    },
    path: "/emails",
    Component: TestEmails,
  },
  { path: "/", Component: Landing },
  { path: "/setup", Component: SetupForm },
  { path: "/home", Component: Home },
  { path: "/email/:emailid", Component: ViewEmail },
  {
    loader: async ({ params }) => {
      const projectId = params.projectId;
      if (!projectId) {
        throw new Error("Missing project ID in route params");
      }
      return { _id: projectId };
    },
    path: "/kanban/:projectId",
    Component: Kanban,
  },
  // { path: '/filter', Component: Filter}
]);

export default router;
