import { fetchAssociatedProperties } from "@/actions/resident-actions";
import LoadingSpinner from "@/app/components/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useAppSelector } from "@/redux/store";
import { Unit } from "@/types";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SectionHeader } from "../../(owner)/properties/owner-property/section-header";

type BuildingSelectorProps = {
  setSelectedBuilding: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function BuildingSelector({
  setSelectedBuilding,
}: BuildingSelectorProps) {
  const { token, user } = useAppSelector((state) => state.auth.value);
  const [properties, setProperties] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      setIsLoading(true);
      try {
        const properties = await fetchAssociatedProperties(
          user.id as string,
          token as string,
        );

        setProperties(
          properties.filter(
            (unit: Unit) =>
              properties.indexOf(unit) ==
              properties.indexOf(
                properties.find(
                  (prop: Unit) => prop.buildingId == unit.buildingId,
                ),
              ),
          ),
        );
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProperties();
  }, [token, user?.id]);

  return (
    <div className="flex flex-col items-center justify-start z-10 mx-4 mt-20">
      {isLoading ? (
        <LoadingSpinner />
      ) : properties.length == 0 ? (
        <div className="text-center font-bold text-2xl">No buildings found</div>
      ) : (
        <>
          <SectionHeader
            title="Building"
            className="text-2xl mt-8 text-center grow"
          />
          <Select onValueChange={(value) => setSelectedBuilding(value)}>
            <SelectTrigger className="mt-8 w-[300px] bg-white dark:bg-white/80 text-black font-semibold mb-4">
              <SelectValue placeholder="Select ..." />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-white/90">
              {properties.map((property: Unit) => (
                <SelectItem
                  key={property.id}
                  value={property.buildingId}
                  className="text-black font-medium"
                >
                  {`${property.buildingName}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}
    </div>
  );
}
