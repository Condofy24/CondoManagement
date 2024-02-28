"use client";
import { useEffect } from "react";
import { Property, User } from "@/types";
import { API_URL } from "@/global";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/store";
import { columns } from "./columns";
import { DataTable } from "@/app/components/table/data-table";

export default function ManagementDashboardPage() {
  let buildings: Property[] = [];
  const user = useAppSelector((state) => state.auth.value.user);
  useEffect(() => {
    const fetchBuildings = async (user: User | null) => {
      if (!user?.companyId) return [];

      try {
        const { data } = await axios.get<Property[]>(
          `${API_URL}/building/${user?.companyId}`,
        );

        buildings = data;
      } catch (error) {
        toast.error("Could not loading your properties, please try again...");
      }
    };

    fetchBuildings(user);
  }, []);

  return (
    <div className="flex flex-1 flex-col p-4 space-y-8 md:p-16 mb-10">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hi {user?.name}</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list your company&apos;s properties!
          </p>
        </div>
        <div className="flex items-center space-x-2"></div>
      </div>
      <DataTable columns={columns} data={buildings} />
    </div>
  );
}
