"use client";
import * as React from "react";
import { useAppSelector } from "@/redux/store";

export default function Home() {
  const user = useAppSelector((state) => state.authReducer.value.userInfo);

  return <main>
    <h1>
      Welcome to the home page!

      Username: {JSON.stringify(user)}
    </h1>
  </main>;
}
