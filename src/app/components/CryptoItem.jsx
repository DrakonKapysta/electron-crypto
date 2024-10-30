import React from "react";
import { Link, useLocation } from "react-router-dom";
import useStore from "../store/store";
import { cn } from "../lib/utils";

export default function CryptoItem({ title }) {
  const location = useLocation();
  const { pathname } = location;

  return (
    <div className="text-2xl px-1 max-w-[80%] border-white ">
      <Link
        to={`/${title}`}
        className={cn(
          "rounded relative w-full inline-flex group bg-[#F9F9FA] items-center justify-center px-5 py-1 cursor-pointer border-b-4 border-l-2 active:border-[#F9F9FA] active:shadow-none shadow-lg text-[#09090A]",
          {
            "text-[#4663bc]": pathname.includes(title) || false,
          }
        )}
      >
        <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white group-hover:w-full group-hover:h-full opacity-10"></span>
        <span className="relative">{title}</span>
      </Link>
    </div>
  );
}
