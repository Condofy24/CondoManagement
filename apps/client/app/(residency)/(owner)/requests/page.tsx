"use client";
import { columns } from "./columns";
import { DataTable } from "@/app/components/table/data-table";
import CreateRequestForm from "./create-request-form";
import useRequest from "./request-hook";

export default function Requests() {
  const {
    user,
    requests,
    register,
    handleSubmit,
    onSubmit,
    errors,
    setValue,
    reset,
  } = useRequest();

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
          <CreateRequestForm
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            errors={errors}
            setValue={setValue}
            reset={reset}
          />
        </div>
      </div>
      <DataTable columns={columns} data={requests} />
    </div>
  );
}
