import { DataTable } from "@/app/components/table/data-table";
import { Reservation } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent } from "@/app/components/ui/card";
import { zeroPad } from "@/lib/utils";

type Props = {
  reservations: Reservation[];
};

export default function PastReservations({ reservations }: Props) {
  const columns: ColumnDef<Reservation>[] = [
    {
      accessorKey: "buildingName",
      header: "Building",
    },
    {
      accessorKey: "facilityName",
      header: "Facility",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date: Date = new Date(row.original.date?.at(0) as Date);
        return <span>{date.toLocaleDateString("en-US")}</span>;
      },
    },
    {
      accessorKey: "date",
      header: "Time",
      cell: ({ row }) => {
        const startDate: Date = new Date(row.original.date?.at(0) as Date);
        const endDate: Date = new Date(row.original.date?.at(1) as Date);

        return (
          <span>
            {`${new Date(startDate).getHours()}:${zeroPad(new Date(startDate).getMinutes(), 2)} - ${new Date(endDate).getHours()}:${zeroPad(new Date(endDate).getMinutes(), 2)}`}
          </span>
        );
      },
    },
  ];

  return (
    <Card>
      <CardContent className="m-1 p-3 border-none dark:bg-slate-800/80">
        <DataTable
          columns={columns}
          data={reservations}
          showColumnVisibility={false}
          showRowsPerPage={false}
        />
      </CardContent>
    </Card>
  );
}
