import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { WebSocketProvider } from "./context/WebSocketContext";

createRoot(document.getElementById("root")).render(
  <WebSocketProvider>
    <App />
  </WebSocketProvider>
);
