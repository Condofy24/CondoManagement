import { DataTable } from "@/app/components/table/data-table";
import { Button } from "@/app/components/ui/button";
import { Reservation } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { cancelReservation } from "@/actions/resident-actions";
import { useAppSelector } from "@/redux/store";
import toast from "react-hot-toast";
import { useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { zeroPad } from "@/lib/utils";

type Props = {
  activeReservations: Reservation[];
};

export default function ActiveReservations({ activeReservations }: Props) {
  const [reservations, setReservations] = useState<Reservation[]>([
    ...activeReservations,
  ]);

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

    {
      id: "cancel",
      cell: ({ row }) => {
        const reservation = row.original;

        const { token } = useAppSelector((state) => state.auth.value);

        return (
          <Button
            variant="outline"
            className="bg-red-300 dark:bg-red-500"
            onClick={async () => {
              await cancelReservation(reservation.id, token as string);

              toast.success("Reservation canceled.");

              setReservations((prev) =>
                [...prev].filter((res) => res.id != reservation.id),
              );
            }}
          >
            Cancel
          </Button>
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
