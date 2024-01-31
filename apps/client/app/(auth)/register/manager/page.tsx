"use client";
import RegistationFormInputs from "@/app/components/form/registation-form-inputs";
import ButtonLoadingSpinner from "@/app/components/loader/ButtonLoaderSpinner";
import { cn } from "@/lib/utils";
import {
  TManagerSignupSchema,
  managerSignupSchema,
} from "@/lib/validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ManagerRegistrationPage() {
  const [loading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TManagerSignupSchema>({
    resolver: zodResolver(managerSignupSchema),
  });

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setLoadingText("Signing up...");
  //
  //   const timeout = setTimeout(() => {
  //     setLoadingText(
  //       "This is taking longer than usual. Please wait while backend services are getting started.",
  //     );
  //   }, 5000);
  //
  //   await dispatch(signUpAction(formData, navigate, isConsentGiven, email));
  //   setLoading(false);
  //   setIsConsentGiven(false);
  //   clearTimeout(timeout);
  // };
  //
  const onSubmit = async () => {};

  return (
    <form className="w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
      <div className="mx-auto flex justify-center">
        <div className="flex flex-col items-start mt-6 mb-2 dark:bg-gray-800 p-4 border-1 shadow-black border-gray-700 bg-gray-200/45 rounded-lg">
          <h2
            className={cn(
              "w-[20rem] flex justify-center mb-3 px-3 text-white outline-none font-semibold text-lg text-gray-700/90 dark:text-white/80",
            )}
          >
            Company Details
          </h2>
          <div className="flex flex-col w-full">
            <div className="flex-grow flex flex-col">
              <input
                type="text"
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
                placeholder="Company Name"
                {...register("company")}
              />
              {errors.company && (
                <div className="text-red-600 mt-1 text-sm">
                  {errors.company.message}
                </div>
              )}
              <input
                type="text"
                className="mt-2 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
                placeholder="Address"
                {...register("address")}
              />
              {"address" in errors && errors.address && (
                <div className="text-red-600 mt-1 text-sm">
                  {errors.address.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <RegistationFormInputs register={register} errors={errors} />
      <div className="mt-4">
        <button
          disabled={loading}
          type="submit"
          className={cn(
            `w-full transform rounded-lg bg-gray-700 px-6 py-3 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`,
            "bg-gray-900 text-white outline-none transition-all hover:scale-105 hover:bg-gray-950 focus:scale-110 active:scale-105 dark:bg-white dark:bg-opacity-10",
          )}
        >
          {loading ? (
            <ButtonLoadingSpinner loadingText={"loading"} />
          ) : (
            <span>Sign Up</span>
          )}
        </button>
      </div>
    </form>
  );
}
