"use client";
import CompanyRegistrationForm from "@/app/components/auth/company-registration-form";
import ButtonLoadingSpinner from "@/app/components/loader/ButtonLoaderSpinner";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import * as z from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = ["image/png", "image/jpg", "image/jpeg"];

const signupSchema = object({
  email: string().email(),
  username: string().min(3).max(20),
  phone: string().min(10).max(20),
  profilePicture: z
    .instanceof(File)
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 3MB")
    .refine((file) => {
      return ACCEPTED_FILE_TYPES.includes(file.type);
    }, "File must be a PNG"),
  password: string().min(8).max(20),
}).and(
  object({
    company: string().min(3).max(20),
    address: string().min(10).max(50),
  }).or(
    object({
      companyKey: string().min(6).max(6),
    }),
  ),
);

export type TSignupSchema = TypeOf<typeof signupSchema>;

export default function CompanyRegistrationPage() {
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
      <div className="mx-auto flex justify-center">
        <CompanyRegistrationForm formRegister={register} />
      </div>
      <div className="relative mt-4 flex items-center">
        <span className="absolute">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-3 h-6 w-6 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </span>
        <input
          className="w-full px-11 py-3 formInput"
          placeholder="Username"
          {...register("username")}
        />
      </div>
      {errors.username && (
        <div className="text-red-600 mt-1 text-sm">
          {errors.username.message}
        </div>
      )}
      <div className="relative mt-3 flex items-center">
        <span className="absolute">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-3 h-6 w-6 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </span>
        <input
          className="w-full px-11 py-3 formInput"
          {...register("email")}
          placeholder="Email"
        />
        {errors.email && <span></span>}
      </div>
      {errors.email && (
        <div className="text-red-600 mt-1 text-sm">{errors.email.message}</div>
      )}
      <label
        htmlFor="profilePicture"
        className="mx-auto mt-3 flex cursor-pointer items-center rounded-lg border-2 border-dashed bg-white px-3 py-3 text-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        <h2 className="mx-3 text-gray-400">Profile Photo</h2>
        <input type="file" className="hidden" {...register("profilePicture")} />
      </label>
      {errors.profilePicture && (
        <div className="text-red-600 mt-1 text-sm">
          {errors.profilePicture.message}
        </div>
      )}
      <div className="relative mt-3 flex items-center">
        <span className="absolute">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-3 h-6 w-6 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </span>
        <input
          className="w-full px-10 py-3 formInput"
          {...register("password")}
          placeholder="Password"
        />
      </div>
      {errors.password && (
        <div className="text-red-600 mt-1 text-sm">
          {errors.password.message}
        </div>
      )}
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
