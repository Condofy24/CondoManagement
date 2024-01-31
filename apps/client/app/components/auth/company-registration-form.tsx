import { TSignupSchema } from "@/app/(auth)/register/company/page";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { UseFormRegister } from "react-hook-form";

type registrationMode = "key" | "register";

type CompanyRegistrationFormProps = {
  formRegister: UseFormRegister<TSignupSchema>;
};

export default function CompanyRegistrationForm({
  formRegister,
}: CompanyRegistrationFormProps) {
  const [mode, setMode] = useState<registrationMode>("key");

  return (
    <div className="flex flex-col items-start mt-6 mb-2 dark:bg-gray-800 p-4 border-2 border-gray-700 bg-gray-100 rounded-lg">
      <div className="flex gap-4 mb-4">
        <button
          type="button"
          className={cn(
            "text-sm flex cursor-pointer bg-gray-600 rounded-full  py-2 px-3 text-white outline-none transition hover:scale-110 hover:bg-gray-950 focus:scale-110 active:scale-105 dark:bg-white/10",
            {
              "scale-105 dark:bg-gray-900 bg-gray-800": mode === "key",
            },
          )}
          onClick={() => setMode("key")}
        >
          Have Company Key?
        </button>
        <button
          type="button"
          className={cn(
            "text-sm flex cursor-pointer bg-gray-600 rounded-full  py-2 px-3 text-white outline-none transition hover:scale-110 hover:bg-gray-950 focus:scale-110 active:scale-105 dark:bg-white/10",
            {
              "scale-105 dark:bg-gray-900 bg-gray-800": mode === "register",
            },
          )}
          onClick={() => setMode("register")}
        >
          Register Company
        </button>
      </div>
      <div className="flex flex-col w-full">
        {mode == "key" && (
          <input
            type="text"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
            placeholder="Enter Company Key"
            {...formRegister("companyKey")}
          />
        )}

        {mode === "register" && (
          <div className="flex-grow flex flex-col gap-4">
            <input
              type="text"
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
              placeholder="Company Name"
              {...formRegister("company")}
            />
            <input
              type="text"
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
              placeholder="Address"
              {...formRegister("address")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
