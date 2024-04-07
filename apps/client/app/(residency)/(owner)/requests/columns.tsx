"use client";

import { cn } from "@/lib/utils";
import { Request } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Request>[] = [
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
          "rounded-lg p-1 text-sm font-semibold flex flex-1 items-center justify-center",
          row.getValue("status") === "Submitted"
            ? "bg-red-500"
            : "bg-green-500",
        )}
      >
        {row.getValue("status")}
      </div>
    ),
  },
];
