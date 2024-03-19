"use client";

import RegistrationFormInputs from "@/app/components/form/registration-form-inputs";
import ButtonLoadingSpinner from "@/app/components/loader/ButtonLoaderSpinner";
import { cn } from "@/lib/utils";
import {
  TManagerSignupSchema,
  TResidentSignupSchema,
  residentSignupSchema,
} from "@/lib/validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { UseFormRegister, useForm } from "react-hook-form";
import { registerUser } from "@/actions/auth-actions";
import { useRouter } from "next/navigation";
import FormFieldError from "@/app/components/form/form-field-error";
import toast from "react-hot-toast";

export default function RegistrationPage() {
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicError, setProfilePicError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TResidentSignupSchema>({
    resolver: zodResolver(residentSignupSchema),
  });

  const onSubmit = async (data: TResidentSignupSchema) => {
    setLoading(true);

    try {
      await registerUser({ ...data, profilePic });
      toast.success("Registration successful");
      router.push("/login");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="w-full max-w-md text-primary"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-start mt-6 mb-2 dark:bg-gray-800 p-4 border-1 shadow-black border-gray-700 bg-gray-200/45 rounded-lg">
        <div className="flex flex-col w-full">
          <h2
            className={cn(
              "w-[18rem] flex justify-center mb-3 px-3 text-white outline-none font-semibold text-lg text-gray-700/90 dark:text-white/80",
            )}
          >
            Registration Key
          </h2>

          <div className="flex-grow flex flex-col">
            <input
              type="text"
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
              placeholder="Key"
              {...register("unitKey")}
            />

            <FormFieldError fieldError={errors.unitKey} />
          </div>
        </div>
      </div>

      <RegistrationFormInputs
        register={
          register as UseFormRegister<
            TResidentSignupSchema | TManagerSignupSchema
          >
        }
        errors={errors}
        profilePic={{ setProfilePic, profilePicError, setProfilePicError }}
      />
      <div className="mt-4">
        <button
          disabled={loading}
          type="submit"
          className={cn(
            `bg-secondary text-secondary w-full transform rounded-lg px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-300 focus:outline-none focus:ring focus:ring-opacity-50 ${
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
