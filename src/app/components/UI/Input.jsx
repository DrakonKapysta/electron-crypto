import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

export default forwardRef(function Input(
  { className, label, errorMessage, ...props },
  ref
) {
  return (
    <>
      {label && <label htmlFor={props.id || ""}>{label}</label>}
      <input
        ref={ref}
        {...props}
        className={cn(
          "w-full bg-transparent focus:ring-0 placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow",
          className
        )}
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </>
  );
});
