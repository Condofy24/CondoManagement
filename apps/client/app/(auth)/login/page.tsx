"use client";

import Link from "next/link";
import Logo from "@/public/logo.png";
import Image from "next/image";
import ButtonLoadingSpinner from "@/app/components/loader/ButtonLoaderSpinner";
import FormFieldError from "@/app/components/form/form-field-error";
import LoginHooks from "./login-hooks";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const Login = () => {
  const { register, handleSubmit, errors, loading, onSubmit } = LoginHooks();
  const pathname = usePathname();
  const isLogin = pathname ==='/login' ? true : false;

  return (
    <div className="container flex flex-col h-[calc(100vh_-_5rem)] items-center justify-center content-start">
      <div className="mx-auto flex justify-center size-[5rem]">
        <Image src={Logo} alt="Website Logo" />
      </div>
      <div className="mt-4 w-full flex items-center justify-center">
        <Link
          href={"/login"}
          className={cn(
            "border-gray-400 pb-3 text-center font-semibold text-gray-800 dark:text-white/80",
            {
              "border-b-2": isLogin,
            }
          )}
        >
          Sign In
        </Link>
        <Link
          href={"/register"}
          className={cn(
            "ml-4 border-gray-400 pb-3 text-center font-semibold text-gray-800 dark:text-white/80",
            {
              "border-b-2": !isLogin,
            }
          )}
        >
          Sign Up
        </Link>
      </div>
      <form className="w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
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
              id="email"
              type="email"
              className="block w-full rounded-lg border bg-white px-11 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              placeholder="Email address"
              required
              autoComplete="off"
              {...register("email")}
            />
          </div>
          <FormFieldError fieldError={errors.email} />
          <div className="relative mt-4 flex items-center">
            <input
              id="password"
              type="password"
              className="block w-full rounded-lg border bg-white px-10 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              placeholder="Password"
              required
              autoComplete="off"
              {...register("password")}
            />
          </div>
          <FormFieldError fieldError={errors.password} />
          <div className="mt-6">
            <button
              disabled={loading}
              type="submit"
              className={cn(
                `w-full transform rounded-lg bg-gray-700 px-6 py-3 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 ${
                  loading ? "cursor-not-allowed opacity-50" : ""
                }`,
                "bg-gray-900 text-white outline-none transition-all hover:scale-105 hover:bg-gray-950 focus:scale-110 active:scale-105 dark:bg-white dark:bg-opacity-10"
              )}
            >
              {loading ? (
                <ButtonLoadingSpinner loadingText={"loading"} />
              ) : (
                <span>Log In</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
