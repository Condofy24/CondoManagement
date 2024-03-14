"use client";
import { useAppSelector } from "@/redux/store";
import { UserRoles } from "@/types";
import { notFound } from "next/navigation";
import React from "react";

type OwnerLayoutProps = {
  children: React.ReactNode;
};

export default function OwnerLayout({ children }: OwnerLayoutProps) {
  const { loggedIn, user } = useAppSelector((state) => state.auth.value);

  const isOwner = user?.role === UserRoles.OWNER;

  if (!loggedIn || !isOwner) {
    return notFound();
  }

  return <>{children}</>;
}
