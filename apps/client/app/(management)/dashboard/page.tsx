"use client";
import { DataTable } from "@/app/components/table/data-table";
import { columns } from "./columns";
import { Properties } from "@/lib/data";
import { useEffect } from "react";
<<<<<<< Updated upstream

export default function ManagementDashboardPage() {
  useEffect(() => {}, []);
=======
import { Building, User } from "@/types";
import { API_URL } from "@/global";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/context/auth-context";

export default function ManagementDashboardPage() {
  let buildings: Building[] = [];
  const { user } = useAuth();

  useEffect(() => {
    const fetchBuildings = async (user: User | null) => {
      if (!user?.companyId) return [];

      try {
        const { data } = await axios.get<Building[]>(
          `${API_URL}/building/${user?.companyId}`,
        );

        buildings = data;
      } catch (error) {
        toast.error("Could not loading your properties, please try again...");
      }
    };

    fetchBuildings(user);
  }, []);
>>>>>>> Stashed changes

  return (
    <div className="flex flex-1 flex-col p-4 space-y-8 md:p-16 mb-10">
      <div className="flex items-center justify-between space-y-2">
        <div>
<<<<<<< Updated upstream
          <h2 className="text-2xl font-bold tracking-tight">Hi Bob</h2>
=======
          <h2 className="text-2xl font-bold tracking-tight">Hi {user?.name}</h2>
>>>>>>> Stashed changes
          <p className="text-muted-foreground">
            Here&apos;s a list your company&apos;s properties!
          </p>
        </div>
        <div className="flex items-center space-x-2"></div>
      </div>
      <DataTable columns={columns} data={Properties} />
    </div>
  );
}
