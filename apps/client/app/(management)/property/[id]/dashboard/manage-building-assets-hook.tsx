import {
  fetchBuildingUnits,
  fetchBuildingStorages,
  fetchBuildingParkings,
  fetchBuildingFacilities,
} from "@/actions/management-actions";
import { useAssetManagement } from "@/context/asset-management-context";
import { useAppSelector } from "@/redux/store";
import { BuildingAsset, Facility, Parking, Storage, Unit } from "@/types";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export type AssetTypes = Unit[] | Parking[] | Storage[] | Facility[];

const assetFetchAction = (asset: BuildingAsset) => {
  if (asset === BuildingAsset.storage) return fetchBuildingStorages;
  if (asset === BuildingAsset.parking) return fetchBuildingParkings;
  if (asset === BuildingAsset.facility) return fetchBuildingFacilities;

  return fetchBuildingUnits;
};

export default function useBuildingAsset() {
  const {
    assetPage,
    setAssetPage,
    setCurrentAssets,
    currentAssets,
    isFetching,
    setIsFetching,
  } = useAssetManagement();
  const { token } = useAppSelector((state) => state.auth.value);
  const { id: buildingId } = useParams();

  const fetchAssets = useCallback(async () => {
    setIsFetching(true);
    try {
      setCurrentAssets(
        await assetFetchAction(assetPage)(
          buildingId as string,
          token as string,
        ),
      );
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsFetching(false);
    }
  }, [assetPage, buildingId, token, setCurrentAssets]);

  useEffect(() => {
    fetchAssets();
  }, [assetPage, buildingId, token, fetchAssets]);

  return {
    assetPage,
    fetchAssets,
    setAssetPage,
    assets: currentAssets,
    isFetching,
  };
}
