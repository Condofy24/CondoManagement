"use client";
import { useEffect, useState } from "react";
import { Employee, FetchedEmployee } from "@/types";
import { useAppSelector } from "@/redux/store";
import { columns } from "./columns";
import { DataTable } from "@/app/components/table/data-table";
import { fetchEmployees } from "@/actions/management-actions";
import toast from "react-hot-toast";
import { Button } from "@/app/components/ui/button";
import { UserRoles } from "@/types";

export default function ManagementDashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const { admin, token, user } = useAppSelector((state) => state.auth.value);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employees = await fetchEmployees(
          admin?.companyId as string,
          token as string
        );

        setEmployees(
          employees.map((employee: FetchedEmployee) => ({
            ...employee,
            name:
              employee.id === user.id
                ? `${employee.name} (You)`
                : employee.name,
            role: UserRoles[employee.role].toLowerCase(),
          }))
        );
      } catch (error) {
        toast.error((error as Error).message);
      }
    };
    loadEmployees();
  }, [admin?.companyId, token]);

  return (
    <div className="flex flex-1 flex-col p-4 space-y-8 md:p-16 mb-10">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hi {user?.name}</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your employees!
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            Add <span className="hidden md:inline ml-1"> Employee</span>
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={employees} />
    </div>
  );
}
