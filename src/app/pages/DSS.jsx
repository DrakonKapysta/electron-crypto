import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import Input from "../components/UI/Input.jsx";
import { cn } from "../lib/utils";
import { dssFormSchema } from "../schemas/dssFormSchema.js";

export default function DSS() {
  const [dss, setDss] = React.useState(null);
  const [isVerified, setIsVerified] = React.useState(false);
  const { register, formState, handleSubmit, setValue } = useForm({
    defaultValues: {
      message: "",
      publicKey: "",
    },
    resolver: zodResolver(dssFormSchema),
  });
  const onSubmit = async (values) => {
    const res = await window.api.signDss({ message: values.message });
    if (res.status === "success") {
      setValue("publicKey", res.data.publicKey.toString());
      setDss(res.data);
      setIsVerified(false);
    }
  };
  const handleVerify = async (values) => {
    const res = await window.api.verifySignature({
      ...dss,
      publicKey: BigInt(values.publicKey),
    });
    if (res.status === "success") {
      setIsVerified(res.data);
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
          DSS Algorithm
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
          Sign message
        </button>
      </form>
      <div
        className={cn(
          "min-h-10 max-h-10 max-w-96 w-full focus:ring-0 block p-2.5 text-sm text-slate-700 bg-gray-50 rounded-lg border border-gray-300 focus:border-slate-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
          {
            "text-slate-500": !dss,
          }
        )}
      >
        <div className="flex justify-between">
          {dss
            ? `r = ${dss.signature.r.toString()}; s = ${dss.signature.s.toString()}`
            : "Pair (r, s) will be displayed here"}
          {dss && (
            <span
              className={cn("text-end", {
                "text-green-500": isVerified,
                "text-red-500": !isVerified,
              })}
            >
              {isVerified ? "Verified" : "Not verified"}
            </span>
          )}
        </div>
      </div>
      {dss && (
        <form
          className="flex flex-col gap-2 p-4 items-center max-w-96 w-full "
          onSubmit={handleSubmit(handleVerify)}
        >
          <div className="w-full flex gap-2 flex-wrap items-center">
            <span className="text-slate-700 mr-1">Public Key:</span>
            <Input
              {...register("publicKey")}
              errorMessage={errors.publicKey?.message}
              type="text"
              id="publicKey"
              className="max-w-24"
            />
          </div>

          <div className="w-full ">
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Verify
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
