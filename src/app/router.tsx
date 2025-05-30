import { createBrowserRouter } from "react-router";

import Landing from "./routes/Landing";
import SetupForm from "./routes/AccountSetUp";
import Home from "./routes/Home";
import TestEmails from "./routes/TestEmails";
// import Filter from "./routes/Filter"

const router = createBrowserRouter([
  {
    loader: async () => {
      const response = await fetch("http://localhost:3000/getemails", {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
      console.log(response.status);
      return response.json();
    }, path: "/emails", Component: TestEmails
  },
  { path: "/", Component: Landing },
  { path: "/setup", Component: SetupForm },
  { path: "/home", Component: Home },
  // { path: '/filter', Component: Filter}
]);

export default router;
