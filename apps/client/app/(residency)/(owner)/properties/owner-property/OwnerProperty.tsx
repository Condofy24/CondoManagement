import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import BalanceReport from "./balance-report-section";
import ParkingsSection from "./parkings-section";
import UnitSection from "./unit-section";
import { Button } from "@/app/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { Unit } from "@/types";

type OwnerPropertyProps = {
  property: Unit;
};

export default function OwnerProperty({ property }: OwnerPropertyProps) {
  return (
    <Card className="w-[400px]">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle>{property.buildingName}</CardTitle>
        <CardDescription>{property.buildingAddress}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <Separator className="my-1" orientation="horizontal" />
        <UnitSection unit={property} />

        <Separator className="my-3" orientation="horizontal" />
        <BalanceReport property={property} />

        <Separator className="my-3" orientation="horizontal" />
      </CardContent>
      <Sheet>
        <SheetTrigger>
          <Button variant="outline">View Amenities</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Property Amenities</SheetTitle>
          </SheetHeader>
          <ParkingsSection parkings={property.parkings} />
          <SheetFooter>
            <SheetClose asChild>
              <Button type="button">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}
