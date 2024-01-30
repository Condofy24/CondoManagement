import Link from "next/link";
import Logo from "@/public/logo.png";
import Image from "next/image";

const SignIn = () => {
  return (
    <section className="bg-white">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-6">
        <form className="w-full max-w-md">
          <div className="mx-auto flex justify-center">
          <Image className="h-7 w-auto sm:h-8" src={Logo} alt="" />
          </div>
          <div className="mt-6 flex items-center justify-center">
            <Link
              href={"/signin"}
              className="w-1/3 border-b-2 border-blue-500 pb-4 text-center font-medium text-gray-800 "
            >
              Sign In
            </Link>
            <Link
              href={"/signup"}
              className="w-1/3 border-b border-gray-400 pb-4 text-center font-medium text-gray-500 "
            >
              Sign Up
            </Link>
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
              id="email"
              name="email"
              type="email"
             
              className="block w-full rounded-lg border bg-white px-11 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              placeholder="Email address"
              required
              autoComplete="off"
            />
          </div>
          <div className="relative mt-4 flex items-center">
            <input
             id="password"
             name="password"
             type="password"
             className="block w-full rounded-lg border bg-white px-10 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
             placeholder="Password"
             required
             autoComplete="off"
             pattern=".{8,}"  //inforce password to be at least 8 char
             title="Password must be at least 8 characters long"
            />
          </div>
          <div className="mt-6">
            <button
             
              className={`w-full transform rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 ${
                false ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {false ? (
                <div>Loding spinner</div>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignIn;