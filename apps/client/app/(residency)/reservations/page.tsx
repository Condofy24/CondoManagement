"use client";
import { fetchResidentReservations } from "@/actions/resident-actions";
import LoadingSpinner from "@/app/components/loading-spinner";
import { Button } from "@/app/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { useAppSelector } from "@/redux/store";
import { Reservation, ReservationStatus } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ActiveReservations from "./active-reservations";
import PastReservations from "./past-reservations";
import CanceledReservations from "./canceled-reservations";

export default function OwnerPropertiesDashboardPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { token, user } = useAppSelector((state) => state.auth.value);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReservations() {
      setIsLoading(true);
      try {
        const response = await fetchResidentReservations(
          user?.id as string,
          token as string,
        );

        setReservations(response);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReservations();
  }, [token, user?.id]);

  const activeReservations = reservations.filter(
    (res) => res.status == ReservationStatus.ACTIVE,
  );

  const pastReservations = reservations.filter(
    (res) => res.status == ReservationStatus.COMPLETE,
  );

  const canceledReservations = reservations.filter(
    (res) =>
      res.status == ReservationStatus.CANCELED ||
      res.status == ReservationStatus.CANCELED_BY_COMPANY,
  );

  return (
    <div className="flex flex-1 flex-col p-4 space-y-8 md:p-10">
      <div className="flex items-center justify-end space-y-2">
        <Button variant="outline">
          <Link href="/reservations/new">Make New Reservation</Link>
        </Button>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col flex-wrap gap-4 justify-center items-center md:justify-start">
          {!reservations ? (
            <h1>
              Something went wrong when fetching your reservations. Please try
              again later!
            </h1>
          ) : reservations.length == 0 ? (
            <h1>No Reservations found</h1>
          ) : (
            <Tabs defaultValue="active" className="w-full md:w-2/3">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
                <TabsTrigger value="canceled">Canceled</TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                <ActiveReservations activeReservations={activeReservations} />
              </TabsContent>
              <TabsContent value="past">
                <PastReservations reservations={pastReservations} />
              </TabsContent>
              <TabsContent value="canceled">
                <CanceledReservations reservations={canceledReservations} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      )}
    </div>
  );
}
