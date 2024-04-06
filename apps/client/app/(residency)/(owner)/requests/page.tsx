"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/store";
import { columns } from "./columns";
import { DataTable } from "@/app/components/table/data-table";
import toast from "react-hot-toast";
import CreateRequestForm from "./create-request-form";
import { fetchRequests } from "@/actions/resident-actions";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const { token, user } = useAppSelector((state) => state.auth.value);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const requests = await fetchRequests(
          user.id as string,
          token as string,
        );

        setRequests(requests);
      } catch (error) {
        toast.error((error as Error).message);
      }
    };

    loadRequests();
  }, [token, user.id]);

  return (
    <div className="flex flex-1 flex-col p-4 space-y-8 md:p-16 mb-10">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hi {user?.name}</h2>
          <p className="text-muted-foreground">
            Your Requests and their status
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CreateRequestForm />
        </div>
      </div>
      <DataTable columns={columns} data={requests} />
    </div>
  );
}
