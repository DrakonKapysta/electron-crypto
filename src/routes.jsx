import * as React from "react";
import DSS from "./app/pages/DSS.jsx";
import Home from "./app/pages/Home.jsx";
import Sha1 from "./app/pages/Sha1.jsx";

export const routes = [
  { path: "/", element: <Home /> },
  { path: "/sha-1", element: <Sha1 /> },
  { path: "/dss", element: <DSS /> },
];
