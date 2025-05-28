import { createBrowserRouter } from "react-router";

import Landing from "./routes/Landing";
import SetupForm from "./routes/AccountSetUp";
import Home from "./routes/Home";
// import Filter from "./routes/Filter"

const router = createBrowserRouter([
  { path: "/", Component: Landing },
  { path: "/setup", Component: SetupForm },
  { path: "/home", Component: Home },
  // { path: '/filter', Component: Filter}
]);

export default router;
