"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
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
import LoadingSpinner from "@/app/components/loading-spinner";
import FacilitySelector from "./facility-selector";
import {
  PageHeader,
  PageHeaderHeading,
  PageHeaderDescription,
} from "@/app/components/page-header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/app/components/ui/carousel";

export default function CreateReservationPage() {
  const { user, token } = useAppSelector((state) => state.auth.value);

  const [properties, setProperties] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedBuilding, setSelectedBuilding] = useState<string | null>();

  useEffect(() => {
    async function fetchProperties() {
      setIsLoading(true);
      try {
        const properties = await fetchAssociatedProperties(
          user.id as string,
          token as string,
        );

        setProperties(
          properties.filter(
            (unit: Unit) =>
              properties.indexOf(unit) ==
              properties.indexOf(
                properties.find(
                  (prop: Unit) => prop.buildingId == unit.buildingId,
                ),
              ),
          ),
        );
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProperties();
  }, [token, user?.id]);

  return (
    <>
      <PageHeader className="mx-8 items-start max-w-[initial]">
        <PageHeaderHeading className="grow text-left text-2xl">
          Facility Reservation
        </PageHeaderHeading>
        <PageHeaderDescription className="grow text-left text-wrap">
          Welcome to our streamlined Facility Reservation Platform! Quickly find
          and book the amenities in your property with ease. Check availability
          and secure your spot in just a few clicks, ensuring a hassle-free
          experience as you enjoy all your property has to offer.{" "}
        </PageHeaderDescription>
      </PageHeader>
      <section className="">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="mx-8 flex flex-col items-start justify-start z-10">
            <Select
              onValueChange={(value) => setSelectedBuilding(value)}
              defaultValue={undefined}
            >
              <SelectTrigger className="mx-4 grow w-[300px] bg-white dark:bg-white/80 text-black font-semibold mb-4">
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-white/90">
                {properties.map((property: Unit) => (
                  <SelectItem
                    key={property.id}
                    value={property.buildingId}
                    className="text-black font-medium"
                  >
                    {`${property.buildingName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {properties.length == 0 ? (
              <div className="text-center font-bold text-2xl">
                No availabilities found
              </div>
            ) : (
              !!selectedBuilding && (
                <FacilitySelector buildingId={selectedBuilding} />
              )
            )}
          </div>
        )}
      </section>
    </>
  );
}
