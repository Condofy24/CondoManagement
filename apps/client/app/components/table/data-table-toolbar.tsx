"use client";

import { DataTableViewOptions } from "@/app/components/table/data-table-view-options";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filter?: { title: string; key: string };
  showColumnVisibility?: boolean;
}

export default function PropertiesTableToolbar<TData>({
  table,
  filter,
  showColumnVisibility = true,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table ? table.getState().columnFilters.length > 0 : null;
  return (
    !!table && (
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {!!filter && (
            <Input
              placeholder={`Filter by ${filter.title}...`}
              value={
                (table.getColumn(filter.key)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(filter.key)?.setFilterValue(event.target.value)
              }
              className="h-8 w-[150px] lg:w-[250px]"
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
        {showColumnVisibility && <DataTableViewOptions table={table} />}
      </div>
    )
  );
}
