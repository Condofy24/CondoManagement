import { DataTable } from "@/app/components/table/data-table";
import { columns } from "./columns";
import { Properties } from "@/lib/data";
import PropertiesTableToolbar from "./properties-table-toolbar";

export default function CompanyDashboard() {
  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-16 mb-10">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hi Bob</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list your company&apos;s properties!
          </p>
        </div>
        <div className="flex items-center space-x-2"></div>
      </div>
      <DataTable
        columns={columns}
        data={Properties}
        Toolbar={<PropertiesTableToolbar />}
      ></DataTable>
    </div>
  );
}
