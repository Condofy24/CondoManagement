import { DataTable } from "@/app/components/table/data-table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import { Button } from "@/app/components/ui/button";

export default function CreateReservationModal() {
  const [open, setOpen] = useState(false);
  const { user, token } = useAppSelector((state) => state.auth.value);

  const [properties, setProperties] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      setIsLoading(true);
      try {
        const properties = await fetchAssociatedProperties(
          user.id as string,
          token as string,
        );

        setProperties(properties);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProperties();
  }, [token, user?.id]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Make Reservation</Button>
      </SheetTrigger>
      <SheetContent className="w-[350px] md:w-[700px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Facility Reservation</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="flex items-center justify-center mt-4 z-10">
          <Select onValueChange={(value) => setSelectedProperty(value)}>
            <SelectTrigger className="mx-8 grow w-[180px] bg-white dark:bg-white/80 text-black font-semibold mb-8">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-white/90">
              {properties.map((property: Unit) => (
                <SelectItem
                  key={property.id}
                  value={property.id}
                  className="text-black font-medium"
                >
                  {`${property.buildingName} - Unit ${property.unitNumber}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="text-center font-bold text-2xl">
            No availabilities found
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
