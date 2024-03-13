"use client";

import React from "react";
import { notFound } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import AssetManagementContextProvider from "@/context/asset-management-context";

type ManagementLayoutProps = {
  children: React.ReactNode;
};

export default function ManagementLayout({ children }: ManagementLayoutProps) {
  const { loggedIn } = useAppSelector((state) => state.auth.value);

  if (!loggedIn) return notFound();

  return (
    <AssetManagementContextProvider>
      <div>{children}</div>
    </AssetManagementContextProvider>
  );
}
