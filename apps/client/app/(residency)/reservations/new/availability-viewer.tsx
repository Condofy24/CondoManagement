import { fetchFacilityAvailabilities } from "@/actions/resident-actions";
import { Calendar } from "@/app/components/ui/calendar";
import { useAppSelector } from "@/redux/store";
import { FacilityAvailability } from "@/types";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { zeroPad } from "@/lib/utils";
import { AvatarFallback } from "@radix-ui/react-avatar";

const Availability = ({
  availability,
}: {
  availability: FacilityAvailability;
}) => (
  <div className="bg-teal-600/80 py-2 px-2 text-md rounded-md hover:scale-105 transition-all hover-bg-teal">
    {`${new Date(availability.startDate).getHours()}:${zeroPad(new Date(availability.startDate).getMinutes(), 2)} - ${new Date(availability.endDate).getHours()}:${zeroPad(new Date(availability.endDate).getMinutes(), 2)}`}
  </div>
);

type AvailabilityViewerProps = {
  facilityId: string;
};

export default function AvailabilityViewer({
  facilityId,
}: AvailabilityViewerProps) {
  const { token } = useAppSelector((state) => state.auth.value);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availabilities, setAvailabilities] = useState<FacilityAvailability[]>(
    [],
  );
  const [selectedMonthAvailabilities, setSelectedMonthAvailabilities] =
    useState<FacilityAvailability[]>();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAvailabilities() {
      try {
        const availabilities = await fetchFacilityAvailabilities(
          facilityId as string,
          token as string,
        );

        setAvailabilities(availabilities);
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
    fetchAvailabilities();
  }, [token, facilityId]);

  useEffect(() => {
    if (!selectedDate) return;
    setSelectedMonthAvailabilities(
      availabilities.filter((avl) => {
        const avlDate = new Date(avl.startDate);

        return (
          selectedDate.getFullYear() == avlDate.getFullYear() &&
          selectedDate.getMonth() == avlDate.getMonth() &&
          selectedDate.getDate() == avlDate.getDate()
        );
      }),
    );
  }, [selectedDate]);

  return (
    <div className="flex gap-8">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border"
      />
      {selectedMonthAvailabilities && (
        <ScrollArea className="h-[200px] rounded-md border p-4 flex flex-wrap gap-3 overflow-hidden">
          {selectedMonthAvailabilities.map(
            (availability: FacilityAvailability) => (
              <Availability availability={availability} />
            ),
          )}
        </ScrollArea>
      )}
    </div>
  );
}
