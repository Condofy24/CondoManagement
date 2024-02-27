"use client";
import React from "react";
import Logo from "@/public/logo.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

type UserProfileLayoutProps = {
  children: React.ReactNode;
};

export default function UserProfileLayout({
  children,
}: UserProfileLayoutProps) {
  const pathname = usePathname();

  return (
    <section>
      <div className="absolute right-4 top-4"></div>
      <div className="container flex flex-col h-[calc(100vh_-_5rem)] items-center justify-center content-start">
        <div className="mx-auto flex flex-col items-center">
          <div className="w-[5rem] h-[5rem] relative">
            <Image
              src={Logo}
              alt="Website Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h2 className="text-xl font-semibold mt-2">User Profile</h2>
        </div>
        <div className="flex flex-col">{children}</div>
      </div>
    </section>
  );
}
