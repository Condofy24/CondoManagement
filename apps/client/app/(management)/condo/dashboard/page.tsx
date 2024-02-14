import React from "react";
import { DataTable } from "@/app/components/data-table";
import { columns } from "./columns";
import { Properties } from "@/lib/data";

export default function CompanyDashboard() {
  return (
    <div className="flex justify-center items-center py-36">
      <DataTable columns={columns} data={Properties}></DataTable>
    </div>
  );
}
