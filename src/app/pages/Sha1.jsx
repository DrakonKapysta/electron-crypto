import React from "react";
import { Link } from "react-router-dom";
import Input from "../components/UI/Input.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../schemas/alghorithmFormSchema.js";
import { cn } from "../lib/utils.js";

export default function Sha1() {
  const [message, setMessage] = React.useState(null);
  const { register, formState, handleSubmit } = useForm({
    defaultValues: {
      message: "",
    },
    resolver: zodResolver(formSchema),
  });
  const onSubmit = async (values) => {
    const res = await window.api.handleSha1({ message: values.message });
    if (res.status === "success") {
      setMessage(res.data);
    }
  };
  const { errors } = formState;
  return (
    <div className="p-2 flex flex-col gap-2 items-center justify-center container mx-auto">
      <form
        className="flex flex-col gap-2 p-4 shadow-md rounded items-center max-w-96 w-full mb-if-not-last"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-bold mb-2 text-slate-700">
          Sha-1 Algorithm
        </h2>
        <Input
          {...register("message")}
          errorMessage={errors.message?.message}
          placeholder="Text here..."
          type="text"
          id="message"
        />
        <button
          type="submit"
          data-ripple-light="true"
          className="mt-2 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
        >
          Generate Hash
        </button>
      </form>
      <div
        className={cn(
          "min-h-10 max-w-96 w-full focus:ring-0 block p-2.5 text-sm text-slate-700 bg-gray-50 rounded-lg border border-gray-300 focus:border-slate-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
          {
            "text-slate-500": !message,
          }
        )}
      >
        {message ? message : "Hash will be displayed here"}
      </div>
    </div>
  );
}
