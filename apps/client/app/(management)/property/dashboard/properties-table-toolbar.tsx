"use client";

import { DataTableFacetedFilter } from "@/app/components/table/data-table-faceted-filter";
import { DataTableToolbarProps } from "@/app/components/table/data-table-toolbar";
import { DataTableViewOptions } from "@/app/components/table/data-table-view-options";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { unitStatuses } from "@/lib/data";
import { useEffect, useState } from "react";

export default function PropertiesTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table ? table.getState().columnFilters.length > 0 : null;

  return (
    !!table && (
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter tasks..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.set(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
          {table?.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={unitStatuses}
            />
          )}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>
    )
  );
}
