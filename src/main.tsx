import React from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./app/App.tsx";

const root = document.getElementById("root");
if (root != null) {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Boards are placed in random order? not sure
// if there is no project selected, filter tab is throwing an error (should say something like No Emails to filter Yet)
// The success permanent board should go after the board that allows for creation of a new board (cause when creating a new board call interviw stage 2 this becoms the goal board and cant be moved) so i would need to renamed the other board (Low priority)  Sortable container drag test to work and fixe the functionality
// Deleting an opportunity from the board doesnt reset the email flag to Create opportunity -> it remains as go to board
