import { createBrowserRouter } from "react-router";
import Landing from "./routes/Landing";
import SetupForm from "./routes/AccountSetUp";
import ConnectEmails from "./routes/ConnectEmails";
import Kanban from "./routes/Kanban";
import ViewEmail from "./routes/ViewEmail";
import Filter from "./routes/Filter";

const router = createBrowserRouter([
  {
    path: "/", Component: Landing, loader: async () => {
      const response = await fetch(`http://localhost:3000/api/users/check`, {
        credentials: "include"
      })
      const data = await response.json();
      return data
    }
  },
  { path: "/setup", Component: SetupForm },
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
    Component: Filter,
    loader: async () => {
      const res = await fetch("http://localhost:3000/api/direct-emails", {
            method: "POST",
            credentials: "include",
          });
      
          if (!res.ok) throw new Error("Failed to refresh inbox");
      
          // Fetch updated inbox from DB
          // const getRes = await fetch("http://localhost:3000/api/getemails", {
          //   credentials: "include",
          // });
          // const data = await getRes.json();
      const response = await fetch(
        `http://localhost:3000/api/projects/filter-emails`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      return data;
    },
  },
  {
    path: "/board",
    Component: Kanban,
    loader: async () => {
      const response = await fetch('http://localhost:3000/api/board', {
        credentials: "include"
      });
      const data = await response.json();
      return data;
    },
  },
  {
    path: "/inbox", Component: ConnectEmails,
  },
  {
    path: "/email/:emailId", Component: ViewEmail
  },

  // work on the css for the buttoms inbox, kanban,  screener to look better places
  // star working on the pop up of the opportunity and retrieve the color and icon
  // there is a quick small change in the user menu goes to U really quickly when swapping from email/kanban and screener
]);

export default router;
