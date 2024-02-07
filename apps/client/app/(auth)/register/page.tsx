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
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: TSignupSchema) => {
    setLoading(true);

    // send request to server
    console.log(data);

    setLoading(false);
  };

  return (
    <form className="w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
      <RegistationFormInputs
        register={register}
        errors={errors}
        profilePic={{ profilePic, setProfilePic }}
      />
      <div className="mt-4">
        <button
          disabled={loading}
          type="submit"
          className={cn(
            `w-full transform rounded-lg bg-secondary px-6 py-3 text-sm font-medium tracking-wide text-primary transition-colors duration-300 focus:outline-none focus:ring focus:ring-opacity-50 ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`,
            "text-secondary outline-none transition-all hover:scale-105 hover:bg-gray-950 focus:scale-110 active:scale-105 dark:bg-opacity-10",
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
