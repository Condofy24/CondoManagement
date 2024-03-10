"use client";
import { useEffect, useState } from "react";
import { Property } from "@/types";
import { useAppSelector } from "@/redux/store";
import { columns } from "./columns";
import { DataTable } from "@/app/components/table/data-table";
import { fetchProperties } from "@/actions/management-actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";

export default function ManagementDashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const { admin, token, user } = useAppSelector((state) => state.auth.value);
  const router = useRouter();

  useEffect(() => {
    const loadBuilding = async () => {
      try {
        const properties = await fetchProperties(
          admin?.companyId as string,
          token as string,
        );

        setProperties(properties);
      } catch (error) {
        toast.error((error as Error).message);
      }
    };

    loadBuilding();
  }, [admin?.companyId, token]);

  return (
    <div className="flex flex-1 flex-col p-4 space-y-8 md:p-16 mb-10">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hi {user?.name}</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list your company&apos;s properties!
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push("/property/create")}>
            Create <span className="hidden md:inline ml-1"> Property</span>
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={properties}
        redirectPath="/property/id/dashboard"
      />
    </div>
  );
}
