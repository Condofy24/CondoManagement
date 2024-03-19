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

  const isResident =
    user?.role === UserRoles.OWNER || user?.role === UserRoles.RENTER;

  if (!loggedIn || !isResident) {
    return notFound();
  }

  return <>{children}</>;
}
