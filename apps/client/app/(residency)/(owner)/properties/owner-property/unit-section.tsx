import { cn } from "@/lib/utils";
import { Unit } from "@/types";
import { SectionHeader } from "./section-header";

type UnitSectionProps = {
  unit: Unit;
};

type UnitInfoProps = {
  title: string;
  value: string | number;
};

export const PropertyInfo = ({ title, value }: UnitInfoProps) => (
  <div className="flex flex-row justify-between mx-1">
    <span className="text-muted-foreground">{title}</span>
    <span className="font-bold">{value}</span>
  </div>
);

export default function UnitSection({ unit }: UnitSectionProps) {
  return (
    <>
      <div className="flex justify-center items-center">
        <SectionHeader title="Unit" />
      </div>
      <PropertyInfo title="Unit Number" value={unit.unitNumber} />
      <PropertyInfo title="Size" value={unit.size + " \u33A1"} />
      <PropertyInfo
        title="Fees"
        value={unit.fees.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
      />
      <div
        className={cn(
          "rounded-lg p-1 font-semibold text-center text-black/80 dark:text-black/90 mt-4",
          unit.isOccupiedByRenter
            ? "bg-red-300 dark:bg-red-500"
            : "bg-green-300 dark:bg-green-500",
        )}
      >
        {unit.isOccupiedByRenter ? "Occupied By Renter" : "Available To Rent"}
      </div>
    </>
  );
}
