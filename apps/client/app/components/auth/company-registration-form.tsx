import { cn } from "@/lib/utils";
import React, { useState } from "react";

type registrationMode = "key" | "register";

export default function CompanyRegistrationForm() {
  const [mode, setMode] = useState<registrationMode>("key");

  return (
    <div className="flex flex-col items-start mt-8 mb-2 dark:bg-gray-800 p-4">
      <div className="flex gap-4 mb-4">
        <button
          className={cn(
            "flex cursor-pointer rounded-full bg-gray-900 py-2 px-3 text-white outline-none transition hover:scale-110 hover:bg-gray-950 focus:scale-110 active:scale-105",
            {
              "scale-105 dark:bg-white/10": mode === "key",
            },
          )}
          onClick={() => setMode("key")}
        >
          Have Company Key?
        </button>
        <button
          className={cn(
            "flex cursor-pointer rounded-full bg-gray-900 py-2 px-3 text-white outline-none transition hover:scale-110 hover:bg-gray-950 focus:scale-110 active:scale-105",
            {
              "scale-105 dark:bg-white/10": mode === "register",
            },
          )}
          onClick={() => setMode("register")}
        >
          Register Company
        </button>
      </div>

      {mode == "key" && (
        <input
          type="text"
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
          placeholder="Enter Company Key"
        />
      )}

      {mode === "register" && (
        <div className="w-full flex-grow flex flex-col items-start gap-4">
          <input
            type="text"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
            placeholder="Company Name"
          />
          <input
            type="text"
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
            placeholder="Address"
          />
        </div>
      )}
    </div>
  );
}
