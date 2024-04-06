"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/components/ui/select";
import { useEffect, useState } from "react";
import { fetchAssociatedProperties } from "@/actions/resident-actions";
import { Unit } from "@/types";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/store";
import LoadingSpinner from "@/app/components/loading-spinner";
import FacilityAvailabilities from "./facility-availabilities";

type CreateReservationModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function CreateReservationModal({
  open,
  setOpen,
}: CreateReservationModalProps) {
  const { user, token } = useAppSelector((state) => state.auth.value);

  const [properties, setProperties] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedBuilding, setSelectedBuilding] = useState<
    string | undefined
  >();

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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-[350px] md:w-[700px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Facility Reservation</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex flex-col items-center justify-start mt-4 z-10">
            <Select onValueChange={(value) => setSelectedBuilding(value)}>
              <SelectTrigger className="mx-4 grow w-[180px] bg-white dark:bg-white/80 text-black font-semibold mb-8">
                <SelectValue placeholder="Select property" />
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

            {properties.length == 0 ? (
              <div className="text-center font-bold text-2xl">
                No availabilities found
              </div>
            ) : (
              !!selectedBuilding && (
                <FacilityAvailabilities buildingId={selectedBuilding} />
              )
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
