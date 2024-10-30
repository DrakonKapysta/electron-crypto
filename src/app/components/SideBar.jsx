import React from "react";
import CryptoItem from "./CryptoItem.jsx";

const algorithms = ["SHA-1", "DSS"];

export default function SideBar() {
  return (
    <aside className="min-h-screen min-w-40 bg-[#E6E6EA] py-2 flex flex-col gap-5">
      <h3 className="text-2xl font-bold text-center text-[#09090A] ">
        Algorithms
      </h3>
      {algorithms.map((title) => (
        <CryptoItem key={title} title={title} />
      ))}
    </aside>
  );
}
