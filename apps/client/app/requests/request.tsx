"use client";
import { DataTable } from "@/app/components/table/data-table";
import CreateRequestForm from "./create-request-form";
import useRequest from "./request-hook";
import { UserRoles } from "@/types";
import RespondRequest from "./respond-request";
import { useContext } from "react";
import { RequestContext } from "@/context/request-context";
import { reqCols } from "./columns";

export default function Requests() {
  const { req, showModal, setShowModal, setReq } = useContext(RequestContext);
  const {
    user,
    token,
    requests,
    register,
    handleSubmit,
    onSubmit,
    errors,
    setValue,
    reset,
    getReq,
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
        {user?.role === UserRoles.OWNER && (
          <div className="flex items-center space-x-2">
            <CreateRequestForm
              register={register}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              errors={errors}
              setValue={setValue}
              reset={reset}
              user={user}
              token={token}
            />
          </div>
        )}
      </div>
      <RespondRequest
        token={token}
        setShowReqDialog={setShowModal}
        showReqDialog={showModal}
        req={req}
        setReq={setReq}
        getReq={getReq}
      />
      <DataTable
        columns={reqCols({ token, getReq, setReq, setShowModal, user })}
        data={requests}
      />
    </div>
  );
}
