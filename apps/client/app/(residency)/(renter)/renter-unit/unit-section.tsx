import { Unit } from "@/types";
import { SectionHeader } from "../../(owner)/properties/owner-property/section-header";

type UnitSectionProps = {
  unit: Unit;
};

type UnitInfoProps = {
  title: string;
  value: string | number;
};

const PropertyInfo = ({ title, value }: UnitInfoProps) => (
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
    </>
  );
}
