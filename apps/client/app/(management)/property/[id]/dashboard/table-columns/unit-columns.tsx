"use client";

import { Button } from "@/app/components/ui/button";
import { Unit } from "@/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/app/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import StatusCell from "@/app/components/table/data-table-status-cell";
import { useAssetManagement } from "@/context/asset-management-context";

type UnitActionsMenuProps = {
  unit: Unit;
};

const UnitActionsMenu = ({ unit }: UnitActionsMenuProps) => {
  const { setAsset, setMode, setShowDialog } = useAssetManagement();

  return (
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
          onClick={() => {
            setShowDialog(true);
            setAsset(unit);
            setMode("edit");
          }}
        >
          Edit Unit details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const unitColumns: ColumnDef<Unit>[] = [
  {
    accessorKey: "unitNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Unit Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: StatusCell,
  },
  {
    accessorKey: "fees",
    header: "Fees",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const unit = row.original;
      return <UnitActionsMenu unit={unit} />;
    },
  },
];
