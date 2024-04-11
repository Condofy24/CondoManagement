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
import { Facility } from "@/types";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "../../(owner)/properties/owner-property/section-header";

type FacilitySelectorProps = {
  selectedBuilding: string | null;
  setSelectedFacility: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function FacilitySelector({
  selectedBuilding,
  setSelectedFacility,
}: FacilitySelectorProps) {
  const { token } = useAppSelector((state) => state.auth.value);
  const [facilities, setFacilities] = useState<Facility[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFacilities() {
      setIsLoading(true);
      try {
        const facilities = await fetchBuildingFacilities(
          selectedBuilding as string,
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
  }, [token, selectedBuilding]);

  return !selectedBuilding ? null : isLoading ? (
    <LoadingSpinner />
  ) : facilities?.length == 0 ? (
    <h1 className="text-xl font-semibold">Building has no facility</h1>
  ) : (
    <>
      <SectionHeader title="Facility" className="text-2xl text-center" />
      <Select onValueChange={(value) => setSelectedFacility(value)}>
        <SelectTrigger className="mx-4 w-[300px] bg-white dark:bg-white/80 text-black font-semibold mb-8">
          <SelectValue placeholder="Select ..." />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-white/90">
          {facilities?.map((facility: Facility) => (
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
    </>
  );
}
