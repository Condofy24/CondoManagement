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
import { BalanceProgress } from "./balance-progress";

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
  const monthlyBalanceProgress =
    property.remainingMonthlyBalance == 0
      ? 0
      : ((property.totalMonthlyFees -
          (property.remainingMonthlyBalance as number)) /
          property.totalMonthlyFees) *
        100;

  console.log(monthlyBalanceProgress);
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
        <PropertyInfo
          title="Fees"
          value={property.totalMonthlyFees.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        />
        <div
          className={cn(
            "rounded-lg p-1 font-semibold text-center",
            property.isOccupiedByRenter ? "bg-red-400" : "bg-green-400",
          )}
        >
          {property.isOccupiedByRenter
            ? "Occupied By Renter"
            : "Available To Rent"}
        </div>
        <Separator className="my-3" orientation="horizontal" />
        <div className="flex gap-2 items-center flex-nowrap">
          Monthly Balance
          <BalanceProgress
            className="h-8 bg-green-400"
            value={monthlyBalanceProgress}
          >
            {(property.remainingMonthlyBalance as number).toLocaleString(
              "en-US",
              {
                style: "currency",
                currency: "USD",
              },
            )}
          </BalanceProgress>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}
