"use client";

import { Button } from "@/app/components/ui/button";
import { RegistrationKey, Unit, UnitCol } from "@/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/app/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Badge, MoreHorizontal } from "lucide-react";
import StatusCell from "@/app/components/table/data-table-status-cell";
import { useAssetManagement } from "@/context/asset-management-context";
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
import { Input } from "@/app/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

type UnitActionsMenuProps = {
  unit: Unit;
};

const RegistrationKeysPopover = ({
  ownerKey,
  renterKey,
}: {
  ownerKey: RegistrationKey;
  renterKey: RegistrationKey;
}) => {
  return (
    <Popover>
      <PopoverTrigger>View</PopoverTrigger>
      <PopoverContent className="w-full">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Registration Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <Label>Owner</Label>
                <Input
                  readOnly
                  defaultValue={ownerKey.key}
                  className="col-span-2 h-8"
                />
                <div
                  className={cn(
                    "p-2 h-10 rounded-xl text-black",
                    ownerKey.isClaimed ? "bg-red-400" : "bg-green-400"
                  )}
                >
                  {ownerKey.isClaimed ? "Claimed" : "Available"}
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(ownerKey.key);
                  }}
                >
                  Copy
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Label>Renter</Label>
                <Input
                  readOnly
                  className="col-span-2 h-8"
                  defaultValue={renterKey.key}
                />

                <div
                  className={cn(
                    "p-2 h-10 rounded-xl text-black",
                    renterKey.isClaimed ? "bg-red-400" : "bg-green-400"
                  )}
                >
                  {renterKey.isClaimed ? "Claimed" : "Available"}
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(renterKey.key);
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
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

export const unitColumns: ColumnDef<UnitCol>[] = [
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
    header: "Size (sqr feet)",
  },

  {
    accessorKey: "fees",
    header: "Fees ($/sqr foot)",
  },
  {
    accessorKey: "financialStatus",
    header: "Financial Status",
  },
  {
    accessorKey: "availability",
    header: "Availability",
    cell: StatusCell,
  },
  {
    header: "Registration Keys",
    cell: ({ row }) => {
      const ownerKey: RegistrationKey = row.original
        .ownerKey as RegistrationKey;
      const renterKey: RegistrationKey = row.original
        .renterKey as RegistrationKey;

      return (
        <RegistrationKeysPopover ownerKey={ownerKey} renterKey={renterKey} />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const unit = row.original;
      return <UnitActionsMenu unit={unit} />;
    },
  },
];
