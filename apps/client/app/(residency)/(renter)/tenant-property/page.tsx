"use client";
import { useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";
import { fetchAssociatedProperties } from "@/actions/resident-actions";
import toast from "react-hot-toast";
import { Unit } from "@/types";
import LoadingSpinner from "@/app/components/loading-spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import ParkingsSection from "../../(owner)/properties/owner-property/parkings-section";
import StorageSection from "../../(owner)/properties/owner-property/storages-section";
import { SectionHeader } from "../../(owner)/properties/owner-property/section-header";
import { PropertyInfo } from "../../(owner)/properties/owner-property/unit-section";

export default function RenterUnitPage() {
  const { user, token } = useAppSelector((state) => state.auth.value);
  const [property, setProperty] = useState<Unit>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      setIsLoading(true);
      try {
        const properties = await fetchAssociatedProperties(
          user.id as string,
          token as string,
        );

        setProperty((properties as Unit[]).at(0));
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProperties();
  }, [token, user?.id]);

  return (
    <div className="flex flex-1 flex-col p-4 space-y-8 md:p-10">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hi {user?.name}</h2>
          <p className="text-muted-foreground">Here is your rented unit!</p>
        </div>
      </div>
      <div>
        {isLoading && <LoadingSpinner />}
        {!isLoading && !property ? (
          <h1>Could not load your property</h1>
        ) : (
          !!property && (
            <div className="flex items-center gap-8 justify-between">
              <Card className="min-h-[500px] flex-1 mt-8">
                <CardHeader className="flex flex-col gap-2">
                  <CardTitle>{property.buildingName}</CardTitle>
                  <CardDescription>{property.buildingAddress}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-8">
                  <Separator className="my-1" orientation="horizontal" />
                  <div className="flex justify-center items-center">
                    <SectionHeader title="Unit" />
                  </div>
                  <PropertyInfo
                    title="property Number"
                    value={property.unitNumber}
                  />
                  <PropertyInfo
                    title="Size"
                    value={property.size + " \u33A1"}
                  />
                </CardContent>
              </Card>

              <div className="flex flex-col flex-1">
                <StorageSection storages={property.storages} />
                <ParkingsSection parkings={property.parkings}></ParkingsSection>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
