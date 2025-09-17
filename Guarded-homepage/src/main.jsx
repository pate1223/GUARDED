import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // ensure global tokens + dark styles are applied

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
