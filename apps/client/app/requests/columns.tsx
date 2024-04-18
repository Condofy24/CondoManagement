import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { RequestUpdateData, removeRequest } from "@/actions/resident-actions";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Request, User, UserRoles } from "@/types";

export const reqCols = ({
  token,
  getReq,
  setReq,
  setShowModal,
  user,
}: {
  token: string | null;
  getReq: any;
  setReq: React.Dispatch<React.SetStateAction<RequestUpdateData>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
}) => {
  // Define the base columns that are common for all users
  let columns: ColumnDef<Request>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div
          className={cn(
            "rounded-lg p-1 text-sm font-semibold flex items-center justify-center w-32",
            row.getValue("status") === "Submitted"
              ? "bg-red-500"
              : "bg-green-500",
          )}
        >
          {row.getValue("status")}
        </div>
      ),
    },
    {
      accessorKey: "resolutionContent",
      header: "Company Reply",
      cell: ({ row }) => (
        <div className="italic">
          <p>{row.getValue("resolutionContent")}</p>
        </div>
      ),
    },
  ];

  // Check the user's role and conditionally add the "actions" column
  if (
    user.role !== UserRoles.OWNER &&
    user.role !== UserRoles.MANAGER &&
    user.role !== UserRoles.RENTER
  ) {
    columns.push({
      id: "actions",
      header: () => <div className="text-center">Manage Requests</div>,
      cell: ({ row }) => {
        const req = row.original;
        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await removeRequest(req._id, token as unknown as string);
                    await getReq();
                  }}
                >
                  Resolve request
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    setReq((prev) => ({
                      ...prev,
                      id: req._id,
                    }));
                    setShowModal(true);
                  }}
                >
                  Respond
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    });
  }

  return columns;
};
