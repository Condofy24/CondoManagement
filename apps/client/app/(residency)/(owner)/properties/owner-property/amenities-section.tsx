import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import { Parking, Storage } from "@/types";
import ParkingsSection from "./parkings-section";
import StorageSection from "./storages-section";

type AmenitiesSectionProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  parkings: Parking[];
  storages: Storage[];
};

export default function AmenitiesSection({
  open,
  setOpen,
  parkings,
  storages,
}: AmenitiesSectionProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-[500px] flex flex-col ">
        <SheetHeader>
          <SheetTitle>Property Amenities</SheetTitle>
        </SheetHeader>
        <ParkingsSection parkings={parkings} />
        <StorageSection storages={storages} />
      </SheetContent>
    </Sheet>
  );
}
