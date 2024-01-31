"use client";
import Link from "next/link";
import React from "react";
import Logo from "@/public/logo.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type RegistrationLayoutProps = {
  children: React.ReactNode;
};

export default function RegistrationLayout({
  children,
}: RegistrationLayoutProps) {
  const pathname = usePathname();

  const isCompanyManagerRegistering = pathname.includes("company");

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
      <div className="container flex flex-col h-[calc(100vh_-_3rem)] items-center justify-center px-6 content-start">
        <div className="mx-auto flex justify-center h-[5rem] w-[5rem]">
          <Image src={Logo} alt="Website Logo" />
        </div>
        <div className="mt-6 w-full flex items-center justify-center">
          <Link
            href={"/register"}
            className={cn(
              "w-1/3 border-gray-400 pb-4 text-center font-semibold text-gray-800 dark:text-white/80",
              {
                "border-b-2": !isCompanyManagerRegistering,
              },
            )}
          >
            Owner / Tenant
          </Link>
          <Link
            href={"/register/company"}
            className={cn(
              "w-1/3 border-gray-400 pb-4 text-center font-semibold text-gray-800 dark:text-white/80",
              {
                "border-b-2": isCompanyManagerRegistering,
              },
            )}
          >
            Company Manager
          </Link>
        </div>
        <div className="flex flex-col">{children}</div>
      </div>
    </section>
  );
}
