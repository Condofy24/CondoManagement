import {
  createReservation,
  fetchFacilityAvailabilities,
} from "@/actions/resident-actions";
import { useAppSelector } from "@/redux/store";
import { FacilityAvailability } from "@/types";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { zeroPad } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/app/components/ui/scroll-area";
import { SectionHeader } from "../../(owner)/properties/owner-property/section-header";
import { Button } from "@/app/components/ui/button";

type AvailabilityViewerProps = {
  facility: string;
  date: Date;
};

const Availability = ({
  availability,
  onReserve,
}: {
  availability: FacilityAvailability;
  onReserve: (availabilityId: string, date: Date) => Promise<void>;
}) => (
  <div className="flex justify-between items-center bg-teal-300/70 dark:bg-teal-500/80 py-2 px-2 text-md rounded-md hover:scale-105 transition-all hover-bg-teal space-x-4">
    <span className="text-black text-lg font-medium ">
      {`${new Date(availability.startDate).getHours()}:${zeroPad(new Date(availability.startDate).getMinutes(), 2)} - ${new Date(availability.endDate).getHours()}:${zeroPad(new Date(availability.endDate).getMinutes(), 2)}`}
    </span>
    <Button
      variant="secondary"
      className="font-medium text-md text-white bg-black/60 dark:bg-opacity-70"
      onClick={async () => {
        await onReserve(availability.id, new Date(availability.startDate));
      }}
    >
      Reserve
    </Button>
  </div>
);

export default function AvailabilityViewer({
  facility,
  date,
}: AvailabilityViewerProps) {
  const { token, user } = useAppSelector((state) => state.auth.value);

  const [monthlyAvailabilities, setMonthlyAvailabilities] = useState<
    FacilityAvailability[]
  >([]);

  useEffect(() => {
    async function fetchAvailabilities() {
      if (!date) return;
      try {
        const availabilities = await fetchFacilityAvailabilities(
          facility as string,
          token as string,
        );

        setMonthlyAvailabilities(
          availabilities.filter((avl: FacilityAvailability) => {
            const avlDate = new Date(avl.startDate);

            return (
              date.getFullYear() == avlDate.getFullYear() &&
              date.getMonth() == avlDate.getMonth() &&
              date.getDate() == avlDate.getDate()
            );
          }),
        );
      } catch (error) {
        toast.error((error as Error).message);
      }
    }

    fetchAvailabilities();
  }, [token, facility, date]);

  const reserveAvailability = async (availabilityId: string, date: Date) => {
    try {
      await createReservation(
        availabilityId,
        user?.id as string,
        token as string,
      );

      setMonthlyAvailabilities((prev) =>
        prev.filter((av) => av.id != availabilityId),
      );

      toast.success(
        `Reservation confirmed for ${date.toLocaleDateString("en-US")}`,
      );
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {monthlyAvailabilities && monthlyAvailabilities?.length != 0 ? (
        <>
          <SectionHeader
            title={`${date.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`}
            className="text-2xl mt-8 text-center grow"
          />
          <ScrollArea className="my-4 h-auto mx-8 rounded-md border">
            <div className="p-4 space-y-4">
              {monthlyAvailabilities.map(
                (availability: FacilityAvailability) => (
                  <Availability
                    key={availability.id}
                    availability={availability}
                    onReserve={reserveAvailability}
                  />
                ),
              )}
            </div>
            <ScrollBar />
          </ScrollArea>
        </>
      ) : (
        <h1 className="my-8 md:my-auto text-2xl text-wrap font-semibold text-center">
          Facility has no availabilites for the selected date.
        </h1>
      )}
    </div>
  );
}
