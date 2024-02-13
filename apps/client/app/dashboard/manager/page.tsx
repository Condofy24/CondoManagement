import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Properties } from "@/lib/data";

export default function CompanyDashboard() {
  return (
    <div className="flex justify-center items-center">
      <DataTable columns={columns} data={Properties}></DataTable>
    </div>
  );
}
