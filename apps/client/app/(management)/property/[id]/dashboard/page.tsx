"use client";

import { ManagerOptions } from "./manager-options";
import { BuildingAssetType, Parking, Unit, Storage } from "@/types";
import UseAssets from "./manage-building-assets-hook";
import { unitColumns } from "./table-columns/unit-columns";
import { assetsColumns } from "./table-columns/assets-columns";
import CreateUpdateAssetModal from "./create-update-asset-modal";
import { DataTable } from "@/app/components/table/data-table";
import AssetManagementContextProvider from "@/context/asset-management-context";
import { useParams } from "next/navigation";

export default function AssetsDashboard() {
  const { assetPage, setAssetPage, assets } = UseAssets();
  const assetID = useParams().id;
  console.log(assetPage, assets);
  return (
    <AssetManagementContextProvider>
      <div className="flex flex-1 flex-col p-4 space-y-8 md:p-16 mb-10">
        <p className="flex items-center justify-center text-muted-foreground font-bold text-3xl">
          {getTitle(assetPage, assetID as string)}
        </p>
        <div className="w:fit">
          <ManagerOptions setAssetPage={setAssetPage} />
        </div>
        <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 px-4 py-2 w-fit">
          <CreateUpdateAssetModal assetName={assetPage} />
        </div>
        {getTable(assetPage, assets)}
      </div>
    </AssetManagementContextProvider>
  );
}

const getTitle = (assetPage: BuildingAssetType, assetID: string) => {
  switch (assetPage) {
    case BuildingAssetType.unit:
      return `Building #${assetID} Units`;
    case BuildingAssetType.parking:
      return `Building #${assetID} Parking`;
    case BuildingAssetType.storage:
      return `Building #${assetID} Storage`;
  }
};

const getTable = (
  assetPage: BuildingAssetType,
  assets: Unit[] | Parking[] | Storage[]
) => {
  switch (assetPage) {
    case BuildingAssetType.unit:
      return <DataTable columns={unitColumns} data={assets as Unit[]} />;

    case BuildingAssetType.parking:
      return (
        <DataTable
          columns={assetsColumns("parkingNumber", BuildingAssetType.parking)}
          data={assets as Parking[]}
        />
      );

    case BuildingAssetType.storage:
      return (
        <DataTable
          columns={assetsColumns("storageNumber", BuildingAssetType.storage)}
          data={assets as Storage[]}
        />
      );
  }
};
