"use client";
import { useState } from "react";
import FacilitySelector from "./facility-selector";
import BuildingSelector from "./building-selector";
import { Calendar } from "@/app/components/ui/calendar";
import AvailabilityViewer from "./availability-viewer";
import { Separator } from "@/app/components/ui/separator";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateReservationPage() {
  const [building, setBuilding] = useState<string | null>(null);
  const [facility, setFacility] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>();

  return (
    <div className="grow flex flex-col md:flex-row mx-4 justify-around gap-4">
      <div className="relative basis-1/2 mx-8 flex flex-col gap-4 items-center">
        <Button
          variant="outline"
          className="absolute left-1 top-2 -mx-8 space-x-2"
        >
          <ArrowLeft />
          <Link href="/reservations">Reservations</Link>
        </Button>
        <BuildingSelector setSelectedBuilding={setBuilding} />
        {building && (
          <FacilitySelector
            selectedBuilding={building}
            setSelectedFacility={setFacility}
          />
        )}
        {!!building && !!facility && (
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border w-fit"
          />
        )}
      </div>

      <div className="basis-1/2 flex-col md:flex-row flex justify-evenly ">
        {!!building && !!facility && !!date && (
          <>
            <Separator
              orientation="vertical"
              className="my-auto hidden md:inline"
            />
            <Separator
              orientation="horizontal"
              className="my-auto inline md:hidden"
            />
            <AvailabilityViewer facility={facility} date={date} />
          </>
        )}
      </div>
    </div>
  );
}
