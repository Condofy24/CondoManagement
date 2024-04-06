"use client";
import { useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/app/components/loading-spinner";
import CreateReservationModal from "./create-reservation";
import { Button } from "@/app/components/ui/button";

export default function OwnerPropertiesDashboardPage() {
  const { user, token } = useAppSelector((state) => state.auth.value);
  const [isLoading, setIsLoading] = useState(false);

  const [openReservations, setOpenReservations] = useState(false);

  return (
    <div className="flex flex-1 flex-col p-4 space-y-8 md:p-10">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Facility Reservations
          </h2>
        </div>
        <div>
          <Button variant="outline" onClick={() => setOpenReservations(true)}>
            Make Reservation
          </Button>
        </div>
        <CreateReservationModal
          open={openReservations}
          setOpen={setOpenReservations}
        />
      </div>
      <div className="flex flex-row flex-wrap gap-4 justify-center md:justify-start">
        {isLoading && <LoadingSpinner />}

        <h1>No Reservations found</h1>
      </div>
    </div>
  );
}
