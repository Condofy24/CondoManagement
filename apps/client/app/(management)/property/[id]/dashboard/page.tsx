"use client";

import { ManagerOptions } from "./manager-options";
import { Parking, Unit, Storage, BuildingAsset, Facility } from "@/types";
import useAssets from "./manage-building-assets-hook";
import { unitColumns } from "./table-columns/unit-columns";
import { assetsColumns } from "./table-columns/assets-columns";
import CreateUpdateAssetModal from "./create-update-asset-modal";
import { DataTable } from "@/app/components/table/data-table";
import AddPaymentModal from "./make-payment-modal";
import LoadingSpinner from "@/app/components/loading-spinner";
import { facilityColumns } from "./table-columns/facility-columns";

export default function AssetsDashboard({
  params,
}: {
  params: { id: string };
}) {
  const { assetPage, setAssetPage, assets, isFetching } = useAssets(params.id);
  return (
    <div className="flex flex-1 flex-col p-4 space-y-5 md:p-16 mb-10">
      <p className="flex items-center justify-center text-muted-foreground font-bold text-3xl">
        {getAssetPageTitle(assetPage)}
      </p>
      <div className="w-fit">
        <ManagerOptions setAssetPage={setAssetPage} />
      </div>
      <div className="inline-flex items-center justify-end whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-10 px-4 py-2 w-fit">
        <CreateUpdateAssetModal assetName={assetPage} />
      </div>
      <AddPaymentModal />
      {isFetching ? (
        <div className="flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        getTable(assetPage, assets)
      )}
    </div>
  );
}

const getAssetPageTitle = (assetPage: string) => {
  const assetPageTitle = assetPage.charAt(0).toUpperCase() + assetPage.slice(1);

  return assetPageTitle === BuildingAsset.facility
    ? "Facilities"
    : assetPageTitle;
};

const getTable = (
  assetPage: BuildingAsset,
  assets: Unit[] | Parking[] | Storage[] | Facility[],
) => {
  switch (assetPage) {
    case BuildingAsset.unit: {
      return (
        <DataTable
          columns={unitColumns}
          data={assets as Unit[]}
          filter={{
            title: "unit number",
            key: "unitNumber",
          }}
        />
      );
    }

    case BuildingAsset.parking:
      return (
        <DataTable
          columns={assetsColumns("parkingNumber", BuildingAsset.parking)}
          data={assets as Parking[]}
          filter={{
            title: "parking number",
            key: "parkingNumber",
          }}
        />
      );

    case BuildingAsset.storage:
      return (
        <DataTable
          columns={assetsColumns("storageNumber", BuildingAsset.storage)}
          data={assets as Storage[]}
          filter={{
            title: "storage number",
            key: "storageNumber",
          }}
        />
      );

    case BuildingAsset.facility:
      return (
        <DataTable
          columns={facilityColumns}
          data={assets as Facility[]}
          filter={{
            title: "facility name",
            key: "name",
          }}
        />
      );
  }
};
