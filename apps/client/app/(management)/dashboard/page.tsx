"use client";
import { useEffect, useState } from "react";
import { Property } from "@/types";
import { useAppSelector } from "@/redux/store";
import { columns } from "./columns";
import { DataTable } from "@/app/components/table/data-table";
import { fetchProperties } from "@/actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";

export default function ManagementDashboardPage() {
  const [buildings, setBuildings] = useState<Property[]>([]);
  const { admin, token, user } = useAppSelector((state) => state.auth.value);
  const router = useRouter();

  useEffect(() => {
    const result = fetchProperties(admin?.companyId as string, token as string);

    if (result instanceof Error) {
      toast.error("Something went wrong getting your properties information");
    } else {
      result.then((data) => {
        setBuildings(data);
      });
    }
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
            Create Building
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={buildings} />
    </div>
  );
}
