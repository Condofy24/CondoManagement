import { useContext, useEffect } from "react";
import { columns } from "./columns";
import { EmployeesContext } from "@/context/employees-context";
import { DataTable } from "@/app/components/table/data-table";
import { fetchEmployees } from "@/actions/management-actions";
import toast from "react-hot-toast";
import { FetchedEmployee, UserRoles } from "@/types";
import { useAppSelector } from "@/redux/store";

const Employees = () => {
  const { employees, refetch, setRefetch, setEmployees } =
    useContext(EmployeesContext);
  const { admin, token, user } = useAppSelector((state) => state.auth.value);

  const loadEmployees = async () => {
    try {
      const employees = await fetchEmployees(
        admin?.companyId as string,
        token as string,
      );

      setEmployees(
        employees.map((employee: FetchedEmployee) => ({
          ...employee,
          name:
            employee.id === user.id ? `${employee.name} (You)` : employee.name,
          role: UserRoles[employee.role].toLowerCase(),
        })),
      );
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [admin?.companyId, token]);

  useEffect(() => {
    if (refetch) {
      loadEmployees();
      setRefetch(false);
    }
  }, [refetch]);

  return <DataTable columns={columns} data={employees} />;
};

export default Employees;
