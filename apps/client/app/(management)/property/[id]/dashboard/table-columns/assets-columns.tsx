"use client";

import { Button } from "@/app/components/ui/button";
import { BuildingAssetType, Asset } from "@/types";
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

type AssetActionsMenuProps = {
  asset: Asset;
  assetName: string;
};

const AssetActionsMenu = ({ asset, assetName }: AssetActionsMenuProps) => {
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
            setAsset(asset);
            setMode("edit");
          }}
        >
          Edit {assetName} details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const assetsColumns = (
  assetIdKey: string,
  assetName: BuildingAssetType,
): ColumnDef<Asset>[] => {
  const columns: ColumnDef<Asset>[] = [
    {
      accessorKey: assetIdKey,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {assetName} Number
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "fees",
      header: "Fees",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const asset: Asset = row.original;
        return <AssetActionsMenu asset={asset} assetName={assetName} />;
      },
    },
  ];
  return columns;
};
