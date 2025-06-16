import { createBrowserRouter } from "react-router";
import Landing from "./routes/Landing";
import SetupForm from "./routes/AccountSetUp";
import Home from "./routes/Home";
import EmailSection from "../components/ui/EmailSection";
import Kanban from "./routes/Kanban";
import ViewEmail from "./routes/ViewEmail";
// import Filter from "./routes/Filter"

const router = createBrowserRouter([
  { path: "/", Component: Landing },
  { path: "/setup", Component: SetupForm },

  {
    path: "/projects/:projectId",
    children: [
      { path: "home", Component: Home },
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
        path: "inbox",
        Component: EmailSection,
      },
      // { path: "screener", Component: filter }
      { path: "inbox/:emailId", Component: ViewEmail }, // its supposed to be /:projectId/email/:emailId
    ],
  },
  { path: "/:projectId/email/:emailId", Component: ViewEmail },
  // If the user is already in the databbase he doesn't need to go through create a prject but directly to home
  // fix the routes so that all have the project id before the inbox, kanban, and screener
  // make sure each project has its own inbox, kanban, screnner
  // work on the css for the buttoms inbox, kanban,  screener to look better places
  // star working on the pop up of the opportunity and retrieve the color and icon
  // there is a quick small change in the user menu goes toU really quickly when swapping from email/kanban and screener
]);

export default router;
