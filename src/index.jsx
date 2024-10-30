import * as React from "react";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./app/components/RootLayout.jsx";
import { routes } from "./routes.jsx";
const { createRoot } = require("react-dom/client");

const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: routes,
    },
    {
      path: "/protected/*",
      element: <div>Protected</div>,
      children: [
        {
          path: "page1",
          element: <div>Page 1</div>,
        },
        {
          path: "page2",
          element: <div>Page 2</div>,
        },
      ],
    },
  ],
  {
    basename: "/main_window",
  }
);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
