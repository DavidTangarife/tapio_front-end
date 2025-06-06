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
  { path: "/kanban", Component: Kanban },
  { path: "/email/:emailid", Component: ViewEmail }
  // { path: '/filter', Component: Filter}
]);

export default router;
