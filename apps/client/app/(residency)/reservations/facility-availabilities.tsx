import { fetchBuildingFacilities } from "@/actions/resident-actions";
import LoadingSpinner from "@/app/components/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useAppSelector } from "@/redux/store";
import { Facility, Unit } from "@/types";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

type FacilityAvailabilitiesProps = {
  buildingId: string;
};

export default function FacilityAvailabilities({
  buildingId,
}: FacilityAvailabilitiesProps) {
  const { user, token } = useAppSelector((state) => state.auth.value);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFacilities() {
      setIsLoading(true);
      try {
        const facilities = await fetchBuildingFacilities(
          buildingId as string,
          token as string,
        );

        setFacilities(facilities);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFacilities();
  }, [token, user?.id]);
  return (
    <div className="grow">
      {isLoading ? (
        <LoadingSpinner />
      ) : facilities.length == 0 ? (
        <h1 className="text-xl font-semibold">Building has no facility</h1>
      ) : (
        <Select onValueChange={(value) => setSelectedFacility(value)}>
          <SelectTrigger className="mx-8 grow w-[180px] bg-white dark:bg-white/80 text-black font-semibold mb-8">
            <SelectValue placeholder="Select a facility" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-white/90">
            {facilities.map((facility: Facility) => (
              <SelectItem
                key={facility.id}
                value={facility.id}
                className="text-black font-medium"
              >
                {facility.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
