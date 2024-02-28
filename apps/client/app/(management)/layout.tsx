"use client";

import React from "react";
import { notFound } from "next/navigation";
import { useAuth } from "@/context/auth-context";

type ManagementLayoutProps = {
  children: React.ReactNode;
};

export default function ManagementLayout({ children }: ManagementLayoutProps) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return notFound();

  return <div>{children}</div>;
}
