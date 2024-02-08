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

  const isManagerRegistering = pathname.includes("manager");

  return (
    <section>
      <div className="absolute right-4 top-4">
        <button
          type="button"
          className="flex h-[2rem] w-[7rem] items-center justify-center rounded-full bg-gray-900 text-white outline-none transition-all hover:scale-105 hover:bg-gray-950 focus:scale-110 active:scale-105 dark:bg-white dark:bg-opacity-10"
        >
          <Link href="/login">Login</Link>
        </button>
      </div>
      <div className="container flex flex-col h-[calc(100vh_-_5rem)] items-center justify-center content-start">
        <div className="mx-auto flex justify-center size-[5rem]">
          <Image src={Logo} alt="Website Logo" />
        </div>
        <div className="mt-4 w-full flex items-center justify-center">
          <Link
            href={"/register"}
            className={cn(
              "border-gray-400 pb-3 text-center font-semibold text-primary",
              {
                "border-b-2": !isManagerRegistering,
              },
            )}
          >
            Owner / Tenant
          </Link>
          <Link
            href={"/register/manager"}
            className={cn(
              "ml-4 border-gray-400 pb-3 text-center font-semibold text-primary",
              {
                "border-b-2": isManagerRegistering,
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
