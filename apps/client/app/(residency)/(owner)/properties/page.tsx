"use client";
import { useAppSelector } from "@/redux/store";
import ClaimUnitForm from "./claim-owner-form";
import { useEffect, useState } from "react";
import { fetchAssociatedProperties } from "@/actions/resident-actions";
import toast from "react-hot-toast";
import { Unit } from "@/types";
import LoadingSpinner from "@/app/components/loading-spinner";
import OwnerProperty from "./owner-property";

export default function OwnerPropertiesDashboardPage() {
  const { user, token } = useAppSelector((state) => state.auth.value);
  const [properties, setProperties] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      setIsLoading(true);
      try {
        const properties = await fetchAssociatedProperties(
          user.id as string,
          token as string,
        );

        setProperties(properties);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProperties();
  }, [token, user?.id]);

  return (
    <div className="flex flex-1 flex-col p-4 space-y-8 md:p-16 mb-10">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hi {user?.name}</h2>
          <p className="text-muted-foreground">
            Here are the properties you own!
          </p>
        </div>
        <div className="flex items-center mr-16">
          <ClaimUnitForm />
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-4 justify-center md:justify-start">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          properties.map((property) => {
            return <OwnerProperty property={property} />;
          })
        )}
      </div>
    </div>
  );
}