import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { cn } from "@/lib/utils";
import { Unit } from "@/types";

type OwnerPropertyProps = {
  property: Unit;
};

type PropertyInfoProps = {
  title: string;
  value: string | number;
};

const PropertyInfo = ({ title, value }: PropertyInfoProps) => (
  <div className="flex flex-row justify-between mx-1">
    <span className="text-muted-foreground">{title}</span>
    <span className="font-bold">{value}</span>
  </div>
);

export default function OwnerProperty({ property }: OwnerPropertyProps) {
  return (
    <Card className="w-[400px]">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle>{property.buildingName}</CardTitle>
        <CardDescription>{property.buildingAddress}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <Separator className="my-1" orientation="horizontal" />
        <PropertyInfo title="Unit Number" value={property.unitNumber} />
        <PropertyInfo title="Size" value={property.size} />
        <PropertyInfo title="Fees" value={property.fees} />
        <div
          className={cn(
            "rounded-lg p-1 md:mx-16 font-semibold text-center",
            property.isOccupiedByRenter ? "bg-red-400" : "bg-green-400",
          )}
        >
          {property.isOccupiedByRenter
            ? "Occupied By Renter"
            : "Available To Rent"}
        </div>
        <Separator className="my-3" orientation="horizontal" />
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}
