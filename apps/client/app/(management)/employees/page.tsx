"use client";

import Employees from "./employees";
import { EmployeesContextProvider } from "@/context/employees-context";

export default function EmployeesManagementDashboardPage() {
  return (
    <EmployeesContextProvider>
      <Employees />
    </EmployeesContextProvider>
  );
}
