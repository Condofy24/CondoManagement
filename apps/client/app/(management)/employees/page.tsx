"use client";

import { useAppSelector } from "@/redux/store";
import { Button } from "@/app/components/ui/button";
import Employees from "./employees";
import { EmployeesContextProvider } from "@/context/employees-context";
import AddEmployeeModal from "./modal/add-employee-modal";
import { useState } from "react";

export default function EmployeesManagementDashboardPage() {
  const [showModal, setShowModal] = useState(false);

  const { user } = useAppSelector((state) => state.auth.value);

  return (
    <EmployeesContextProvider>
      <div className="flex flex-1 flex-col p-4 space-y-8 md:p-16 mb-10">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Hi {user?.name}
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your employees!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setShowModal(true)}>
              Add <span className="hidden md:inline ml-1"> Employee</span>
            </Button>
          </div>
        </div>
        <Employees />
      </div>
      {showModal && <AddEmployeeModal />}
    </EmployeesContextProvider>
  );
}
