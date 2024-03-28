"use client";

import { Button } from "@/app/components/ui/button";
import { BuildingAsset, BuildingResource, Facility } from "@/types";
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
import { useAssetManagement } from "@/context/asset-management-context";

const FacilityActionsMenu = ({ facility }: { facility: Facility }) => {
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
            setAsset(facility);
            setShowDialog(true);
            setMode("edit");
          }}
        >
          Edit facility details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const facilityColumns: ColumnDef<Facility>[] = [
  {
    accessorKey: "id",
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "fees",
    header: "Fees ($/\u33A1)",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "operationTimes",
    header: () => <div className="text-center">Operation Times</div>,
    cell: ({ row }) => {
      return (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Weekday
              </th>
              <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Opening Time
              </th>
              <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Closing Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {row.original?.operationTimes?.map((time, index) => (
              <tr key={index}>
                <td className="px-3 py-1 whitespace-nowrap">{time.weekDay}</td>
                <td className="px-3 py-1 whitespace-nowrap">
                  {formatTime(time.openingTime as unknown as number)}
                </td>
                <td className="px-3 py-1 whitespace-nowrap">
                  {formatTime(time.closingTime as unknown as number)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const facility = row.original;
      return <FacilityActionsMenu facility={facility} />;
    },
  },
];

const formatTime = (timeInMinutes: number): string => {
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const ampm = hours < 12 ? "AM" : "PM";
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};
