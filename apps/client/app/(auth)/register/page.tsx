"use client";

import RegistationFormInputs from "@/app/components/form/registation-form-inputs";
import ButtonLoadingSpinner from "@/app/components/loader/ButtonLoaderSpinner";
import { cn } from "@/lib/utils";
import { TSignupSchema, signupSchema } from "@/lib/validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

const SignUpNew = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignupSchema>({
    resolver: zodResolver(signupSchema),
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
};

export default SignUpNew;
