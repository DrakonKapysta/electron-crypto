import React from "react";
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import RootLayout from "./components/RootLayout.jsx";
import Home from "./pages/Home.jsx";

const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [{ path: "/", element: <Home /> }],
    },
  ],
  {
    basename: "/main_window",
  }
);

export default function App() {
  return <RouterProvider router={router} />;
}
