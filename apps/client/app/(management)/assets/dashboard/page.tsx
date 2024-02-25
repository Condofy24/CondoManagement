"use client";

import { DataTable } from "@/app/components/table/data-table";
import {
  ParkingProperties,
  StorageProperties,
  UnitProperties,
} from "@/lib/data";
import { ManagerOptions } from "../../../components/table/manager-options";
import AddAssetDialog from "@/app/components/table/add-asset-dialog";
import { AssetType } from "@/types";
import UseAssets from "./assets-hooks";
import { unitColumns } from "./unit-columns";
import { assetsColumns } from "./assets-columns";

export const ButtonStyle =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 px-4 py-2 w-fit";

export default function AssetsDashboard() {
  const { assetPage, setAssetPage } = UseAssets();

  return (
    <div className="flex flex-1 flex-col p-4 space-y-8 md:p-16 mb-10">
      <p className="flex items-center justify-center text-muted-foreground font-bold text-3xl">
        {getTitle(assetPage)}
      </p>
      <div className="w:fit">
        <ManagerOptions setAssetPage={setAssetPage} />
      </div>

      <div className={ButtonStyle}>
        <AddAssetDialog assetName={assetPage} />
      </div>
      {getTable(assetPage)}
    </div>
  );
}

const getTitle = (assetPage: AssetType) => {
  switch (assetPage) {
    case AssetType.unit:
      return `Building #XYZ Units`;
    case AssetType.parking:
      return `Building #XYZ Parking`;
    case AssetType.storage:
      return `Building #XYZ Storage`;
  }
};

const getTable = (assetPage: AssetType) => {
  switch (assetPage) {
    case AssetType.unit:
      return <DataTable columns={unitColumns} data={UnitProperties} />;

    case AssetType.parking:
      return (
        <DataTable
          columns={assetsColumns("parkingNumber", AssetType.parking)}
          data={ParkingProperties}
        />
      );

    case AssetType.storage:
      return (
        <DataTable
          columns={assetsColumns("storageNumber", AssetType.storage)}
          data={StorageProperties}
        />
      );
  }
};
