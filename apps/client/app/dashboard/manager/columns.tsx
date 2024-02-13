"use client";

import { PropertyInformation } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<PropertyInformation>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "units",
    header: "Units",
  },
  {
    accessorKey: "parkings",
    header: "Parkings",
  },
  {
    accessorKey: "storage",
    header: "storage",
  },
];
