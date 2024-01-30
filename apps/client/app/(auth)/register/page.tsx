"use client";

import ButtonLoadingSpinner from "@/app/components/loader/ButtonLoaderSpinner";
import { cn } from "@/lib/utils";
import Logo from "@/public/logo.png";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TypeOf, object, string } from "zod";

const signupSchema = object({
  email: string().email(),
  username: string().min(3).max(20),
  phone: string().min(10).max(20),
  password: string().min(8).max(20),
});

type TSignupSchema = TypeOf<typeof signupSchema>;

const SignUpNew = () => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureError, setProfilePictureError] = useState<
    string | null
  >();

  const { register, handleSubmit } = useForm<TSignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setProfilePicture(null);
      setProfilePictureError(null);
      return;
    }
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/jpg"
    ) {
      setProfilePicture(null);
      setProfilePictureError(
        "Please upload a valid image file (jpeg, jpg, png)",
      );
    } else if (file.size > 10 * 1024 * 1024) {
      setProfilePicture(null);
      setProfilePictureError("Please upload an image file less than 10MB");
    } else {
      setProfilePicture(file);
      setProfilePictureError(null);
    }
  };
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
  const onSubmit = async (data: TSignupSchema) => {};

  return (
    <section className="relative">
      <div className="absolute right-4 top-4">
        <button
          type="button"
          className="flex h-[2rem] w-[16rem] items-center justify-center rounded-full bg-gray-900 text-white outline-none transition-all hover:scale-105 hover:bg-gray-950 focus:scale-110 active:scale-105 dark:bg-white dark:bg-opacity-10"
        >
          <Link href="/login">Already have an account?</Link>
        </button>
      </div>
      <div className="container mx-auto flex min-h-screen items-center justify-center px-6">
        <form className="w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
          <div className="mx-auto flex justify-center h-[10rem] w-[10rem]">
            <Image src={Logo} alt="Website Logo" />
          </div>
          <div className="relative mt-8 flex items-center">
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
          <div className="relative mt-6 flex items-center">
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
          </div>
          <label
            htmlFor="avatar"
            className="mx-auto mt-6 flex cursor-pointer items-center rounded-lg border-2 border-dashed bg-white px-3 py-3 text-center"
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
            <input id="avatar" type="file" className="hidden" />
          </label>
          {profilePicture && (
            <div className="mt-2 flex items-center justify-center">
              <span className="font-medium text-blue-500">
                {profilePicture.name}
              </span>
            </div>
          )}
          {profilePictureError && (
            <div className="mt-2 flex items-center justify-center">
              <span className="text-red-500">{profilePictureError}</span>
            </div>
          )}

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
          <div className="mt-6">
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
                <ButtonLoadingSpinner loadingText={loadingText} />
              ) : (
                <span>Sign Up</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignUpNew;
