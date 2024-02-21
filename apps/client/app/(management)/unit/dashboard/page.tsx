import { DataTable } from "@/app/components/table/data-table";
import { columns } from "./columns";
import { UnitProperties } from "@/lib/data";
import { Button } from "@/app/components/ui/button";

export default function CompanyDashboard() {
  return (
    <div className="flex flex-1 flex-col p-4 space-y-8 md:p-16 mb-10">
      <p className="flex items-center justify-center text-muted-foreground font-bold text-3xl">
        Building #XYZ Units
      </p>
      <Button className="font-bold w-fit">+ Add a New Unit</Button>
      <DataTable columns={columns} data={UnitProperties}></DataTable>
    </div>
  );
}
