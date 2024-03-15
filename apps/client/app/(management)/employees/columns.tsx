"use client";

import { Button } from "@/app/components/ui/button";
import { Employee } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/ui/popover";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { deleteEmployee } from "@/actions/management-actions";
import { useAppSelector } from "@/redux/store";
import toast from "react-hot-toast";
import { EmployeesContext } from "@/context/employees-context";
import { useContext } from "react";

const DeletePopover = ({
  employeeId,
  employeeName,
}: {
  employeeId: string;
  employeeName: string;
}) => {
  const token = useAppSelector((state) => state.auth.value.token);
  const { setRefetch } = useContext(EmployeesContext);

  const onClickHandler = async () => {
    try {
      await deleteEmployee(employeeId, token as string);
      toast.success(`Deleted ${employeeName}`);
      setRefetch(true);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>Delete</PopoverTrigger>
      <PopoverContent className="w-full">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Delete User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              This cannot be undone. All access will be removed.
              <Button
                className="bg-red-400"
                variant="outline"
                onClick={onClickHandler}
              >
                Confirm
              </Button>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    header: "Delete",
    cell: ({ row }) => {
      return (
        <DeletePopover
          employeeName={row.original.name}
          employeeId={row.original.id}
        />
      );
    },
  },
];
