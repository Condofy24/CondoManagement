"use client";

import { RequestContextProvider } from "@/context/request-context";
import Requests from "./request";

export default function RequestsPage() {
  return (
    <RequestContextProvider>
      <Requests />
    </RequestContextProvider>
  );
}
