import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar.jsx";

export default function RootLayout() {
  return (
    <div className="flex bg-[#F7F7F7]">
      <SideBar />
      <Outlet />
    </div>
  );
}
