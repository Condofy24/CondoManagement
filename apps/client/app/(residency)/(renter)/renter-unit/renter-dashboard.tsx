import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { Unit } from "@/types";
import BalanceReport from "../../(owner)/properties/owner-property/finances/balance-report-section";
import UnitSection from "../../(owner)/properties/owner-property/unit-section";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";
import AmenitiesSection from "../../(owner)/properties/owner-property/amenities-section";
import ParkingsSection from "../../(owner)/properties/owner-property/parkings-section";
import StorageSection from "../../(owner)/properties/owner-property/storages-section";
import { Parking, Storage } from "@/types";
import RenterUnitSection from "./unit-section";

type RenterDashboardProps = {
  property: Unit;
  parkings: Parking[];
  storages: Storage[];
};

export default function RenterDashboard({ 
    property,
    parkings,
    storages
}: RenterDashboardProps) {
  const [openAmenities, setOpenAmenities] = useState(false);

  return (
<div className="flex justify-center gap-9">
  {/* First Card */}
  <div className="w-[400px]">
    <Card className="h-full">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle>{property.buildingName}</CardTitle>
        <CardDescription>{property.buildingAddress}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Separator className="my-1" orientation="horizontal" />
        <RenterUnitSection unit={property} />
        
      </CardContent>
    </Card>
  </div>

  {/* Second Card */}
  <div className="w-[400px]">
    <Card className="h-full">
      <CardContent className="flex flex-col gap-2">
        <StorageSection storages={storages} />
        <Separator className="my-3" orientation="horizontal" />
        <ParkingsSection parkings={parkings}></ParkingsSection>
      </CardContent>
    </Card>
  </div>
</div>
    
  );
}
