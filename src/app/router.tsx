import { createBrowserRouter, useOutletContext } from "react-router";
import Landing from "./routes/Landing";
import SetupForm from "./routes/AccountSetUp";
import ConnectEmails from "./routes/ConnectEmails";
import Kanban from "./routes/Kanban";
import ViewEmail from "./routes/ViewEmail";
import MainLayout from "../components/layouts/MainLayout";
import { lazy, Suspense } from "react";
import Spinner from "../components/ui/Spinner";
import DragTest from "../components/ui/dragtest";

const Filter = lazy(() => import("./routes/Filter"));


const router = createBrowserRouter([
  {
    Component: MainLayout, children: [
      {
        path: "/home", Component: ConnectEmails, loader: async () => {
          const response = await fetch(`http://localhost:3000/api/getemails`, {
            credentials: "include"
          });
          const data = await response.json();
          return data
        }
      },
      {
        path: "/filter",
        element: (
          <Suspense fallback={<Spinner />}>
            <Filter />
          </Suspense>
        ),
        loader: async () => {
          const response = await fetch(
            `http://localhost:3000/api/unprocessed-emails`,
            {
              credentials: "include",
            })
          const data = await response.json();
          return data
        }
      },
      {
        path: "/board",
        Component: DragTest,
        loader: async () => {
          const response = await fetch('http://localhost:3000/api/board', {
            credentials: "include"
          });
          console.log('Running loader')
          const data = await response.json();
          return data;
        },
      },
    ]
  },
  {
    path: "/email/:emailId", Component: ViewEmail
  },
  { path: "/setup", Component: SetupForm },
  {
    path: "/", Component: Landing, loader: async () => {
      const response = await fetch(`http://localhost:3000/api/users/check`, {
        credentials: "include"
      })
      const data = await response.json();
      return data
    }
  },
  { path: "/dragtest", Component: DragTest }


  // work on the css for the buttoms inbox, kanban,  screener to look better places
  // star working on the pop up of the opportunity and retrieve the color and icon
  // there is a quick small change in the user menu goes to U really quickly when swapping from email/kanban and screener
]);

export default router;
