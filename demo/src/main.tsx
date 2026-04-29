import { Analytics } from "@vercel/analytics/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import Examples from "./examples";
import "./index.css";

const Root = window.location.pathname.startsWith("/examples") ? Examples : App;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
    <Analytics />
  </StrictMode>
);
