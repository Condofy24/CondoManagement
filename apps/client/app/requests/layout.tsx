"use client";
import { useAppSelector } from "@/redux/store";
import { UserRoles } from "@/types";
import { notFound } from "next/navigation";
import React from "react";

type ResidencyLayoutProps = {
  children: React.ReactNode;
};

export default function ResidencyLayout({ children }: ResidencyLayoutProps) {
  const { loggedIn, user } = useAppSelector((state) => state.auth.value);

  if (!loggedIn) {
    return notFound();
  }

  return <>{children}</>;
}
