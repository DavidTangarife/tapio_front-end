import { createBrowserRouter } from "react-router";
import Landing from "./routes/Landing";
import SetupForm from "./routes/AccountSetUp";
import ConnectEmails from "./routes/ConnectEmails";
import Inbox from "./routes/Inbox";
import Kanban from "./routes/Kanban";
import ViewEmail from "./routes/ViewEmail";
import Filter from "./routes/Filter";

const router = createBrowserRouter([
  { path: "/", Component: Landing },
  { path: "/setup", Component: SetupForm },
  { path: "/:projectId/email/:emailId", Component: ViewEmail },

  {
    path: "/projects/:projectId",
    children: [
      {
        loader: async ({ params }) => {
          const projectId = params.projectId;
          if (!projectId) {
            throw new Error("Missing project ID in route params");
          }
          return { _id: projectId };
        },
        path: "kanban",
        Component: Kanban,
      },
      {
        loader: async ({ params }) => {
          const response = await fetch(
            `http://localhost:3000/api/projects/${params.projectId}/emails`,
            {
              credentials: "include",
            }
          );
          const data = await response.json(); // parse JSON body (the emails array)
          return data;
        },
        path: "emails",
        Component: Inbox,
      },
      {
        loader: async ({ params }) => {
          const response = await fetch(
            `http://localhost:3000/api/projects/${params.projectId}/emails`,
            {
              credentials: "include",
            }
          );
          const data = await response.json();
          return data;
        },
        path: "filter",
        Component: Filter,
      },
      {
        path: "connect",
        Component: ConnectEmails,
      },
    ],
  },
  // If the user is already in the databbase he doesn't need to go through create a prject but directly to home
  // fix the routes so that all have the project id before the inbox, kanban, and screener
  // make sure each project has its own inbox, kanban, screnner
  // work on the css for the buttoms inbox, kanban,  screener to look better places
  // star working on the pop up of the opportunity and retrieve the color and icon
  // there is a quick small change in the user menu goes toU really quickly when swapping from email/kanban and screener
]);

export default router;
