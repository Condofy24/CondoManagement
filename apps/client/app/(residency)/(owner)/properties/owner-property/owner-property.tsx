import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { Unit } from "@/types";
import BalanceReport from "./finances/balance-report-section";
import UnitSection from "./unit-section";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";
import AmenitiesSection from "./amenities-section";

type OwnerPropertyProps = {
  property: Unit;
};

export default function OwnerProperty({ property }: OwnerPropertyProps) {
  const [openAmenities, setOpenAmenities] = useState(false);

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

        <Button variant="outline" onClick={() => setOpenAmenities(true)}>
          View Amenities
        </Button>
        <AmenitiesSection
          open={openAmenities}
          setOpen={setOpenAmenities}
          parkings={property.parkings}
          storages={property.storages}
        />

        <Separator className="my-3" orientation="horizontal" />
        <BalanceReport property={property} />
      </CardContent>
    </Card>
  );
}
