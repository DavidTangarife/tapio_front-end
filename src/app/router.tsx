import { createBrowserRouter } from "react-router";

import Landing from "./routes/Landing";
import SetupForm from "./routes/AccountSetUp";
import ConnectEmails from "./routes/ConnectEmails";
import Inbox from "./routes/Inbox";
import Kanban from "./routes/Kanban";
import ViewEmail from "./routes/ViewEmail";
import Filter from "./routes/Filter"

const router = createBrowserRouter([
  {
    path: "/projects/:projectId/emails", Component: Inbox,
    loader: async ({ params }) => {
      const response = await fetch(`http://localhost:3000/api/projects/${params.projectId}/emails`, {
        credentials: "include",
      });
      const data = await response.json();  // parse JSON body (the emails array)
      return data;
    },
  },
  { path: "/", Component: Landing },
  { path: "/setup", Component: SetupForm },
  { path: "/projects/:projectId/connect", Component: ConnectEmails },
  { path: "/:projectId/email/:emailId", Component: ViewEmail },
  { 
    path: "/filter/:projectId", Component: Filter,
    loader: async ({ params }) => {
      const response = await fetch(`http://localhost:3000/api/projects/${params.projectId}/emails`, {
        credentials: "include",
    });
    const data = await response.json();
    return data;
    }
  },
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
