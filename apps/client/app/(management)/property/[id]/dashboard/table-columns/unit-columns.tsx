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
import { ArrowUpDown, Badge, Copy, MoreHorizontal } from "lucide-react";
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
import SelectParkingStorageModal from "../link-amentities-modal";

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
                  defaultValue={ownerKey?.key}
                  className="col-span-2 h-8"
                />
                <div
                  className={cn(
                    "p-2 h-10 rounded-xl text-black",
                    ownerKey?.isClaimed
                      ? "bg-red-300 dark:bg-red-500 text-black/80 dark:text-white"
                      : "bg-green-300 dark:bg-green-500 text-black/80 dark:text-white",
                  )}
                >
                  {ownerKey?.isClaimed ? "Claimed" : "Available"}
                </div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(ownerKey?.key);
                  }}
                >
                  <Copy className="h-4 w-4">Copy</Copy>
                </Button>
                <Button
                  onClick={() => {
                    window.open(
                      `mailto:email@example.com?subject=Your%registeration%key&body=${ownerKey?.key}`,
                    );
                  }}
                >
                  Email
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Label>Renter</Label>
                <Input
                  readOnly
                  className="col-span-2 h-8"
                  defaultValue={renterKey?.key}
                />

                <div
                  className={cn(
                    "p-2 h-10 rounded-xl text-black",
                    renterKey?.isClaimed
                      ? "bg-red-300 dark:bg-red-500 text-black/80 dark:text-white"
                      : "bg-green-300 dark:bg-green-500 text-black/80 dark:text-white",
                  )}
                >
                  {renterKey?.isClaimed ? "Claimed" : "Available"}
                </div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(renterKey?.key);
                  }}
                >
                  <Copy className="h-4 w-4">Copy</Copy>
                </Button>
                <Button
                  onClick={() => {
                    window.open(
                      `mailto:email@example.com?subject=Your%registeration%key&body=${renterKey?.key}`,
                    );
                  }}
                >
                  Email
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
  const {
    setAsset,
    setMode,
    setShowPaymentDialog,
    setShowDialog,
    setShowAmenityDialog,
  } = useAssetManagement();

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
        <DropdownMenuItem
          onClick={() => {
            setAsset(unit);
            setShowPaymentDialog(true);
          }}
        >
          Add Payment
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setAsset(unit);
            setShowAmenityDialog(true);
          }}
        >
          Link amenity
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
    header: "Size (\u33A1)",
  },

  {
    accessorKey: "fees",
    header: "Fees ($/\u33A1)",
  },
  {
    accessorKey: "financialStatus",
    header: "Financial Status",
    cell: ({ row }) => {
      const unit: Unit = row.original;

      const hasOverDue = unit.overdueFees && unit.overdueFees > 0;

      const hasMonthlyBalance =
        unit.remainingMonthlyBalance && unit.remainingMonthlyBalance > 0;

      const hasFeesDue = hasOverDue || hasMonthlyBalance;

      return (
        <Card className="p-2 lg:p-3 dark:bg-white/5 lg:w-3/4">
          {!hasFeesDue ? (
            <div className="text-xs lg:text-base font-semibold lg:font-bold flex justify-center">
              {!(unit.ownerKey?.isClaimed || unit.renterKey?.isClaimed)
                ? "Not Available "
                : "Monthly fees paid"}
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="flex flex-col justify-between gap-2 md:basis-3/4">
                {!!hasOverDue && (
                  <span className="text-xs md:text-base font-bold">
                    Overdue <span className="hidden md:inline">fees:</span>
                  </span>
                )}
                {!!hasMonthlyBalance && (
                  <span className="text-xs md:text-base font-bold">
                    Monthly <span className="hidden md:inline">fees:</span>
                  </span>
                )}
              </div>
              <div className="flex flex-col justify-between">
                {!!hasOverDue && (
                  <div className="space-x-4">{unit.overdueFees}$</div>
                )}
                {!!hasMonthlyBalance && (
                  <div className="space-x-4">
                    {unit.remainingMonthlyBalance}$
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      );
    },
  },
  {
    accessorKey: "isOccupiedByRenter",
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
