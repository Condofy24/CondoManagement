import { useContext, useEffect } from "react";
import { columns } from "./columns";
import { EmployeesContext } from "@/context/employees-context";
import { DataTable } from "@/app/components/table/data-table";
import { fetchEmployees } from "@/actions/management-actions";
import toast from "react-hot-toast";
import { FetchedEmployee, UserRoles } from "@/types";
import { useAppSelector } from "@/redux/store";
import { Button } from "@/app/components/ui/button";
import AddEmployeeModal from "./modal/add-employee-modal";

const Employees = () => {
  const {
    employees,
    refetch,
    setShowModal,
    showModal,
    setRefetch,
    setEmployees,
  } = useContext(EmployeesContext);
  const { admin, token, user } = useAppSelector((state) => state.auth.value);

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
            employee.id === user.id ? `${employee.name} (You)` : employee.name,
          role: UserRoles[employee.role].toLowerCase(),
        }))
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

  return (
    <>
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
        <DataTable columns={columns} data={employees} />
      </div>
      {showModal && <AddEmployeeModal />}
    </>
  );
};

export default Employees;
