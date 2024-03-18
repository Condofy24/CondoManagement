import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import AddEmployeeForm from "./add-employee-form";
import { EmployeesContext } from "@/context/employees-context";
import { useContext } from "react";

export default function AddEmployeeModal() {
  const { setShowModal } = useContext(EmployeesContext);

  return (
    <Dialog open={true} onOpenChange={setShowModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
        </DialogHeader>
        <AddEmployeeForm />
      </DialogContent>
    </Dialog>
  );
}
