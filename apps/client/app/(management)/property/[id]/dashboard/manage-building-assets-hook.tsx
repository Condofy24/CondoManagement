import {
  fetchBuildingUnits,
  fetchBuildingStorages,
  fetchBuildingParkings,
} from "@/actions/management-actions";
import { useAssetManagement } from "@/context/asset-management-context";
import { useAppSelector } from "@/redux/store";
import { BuildingAsset, Parking, Storage, Unit } from "@/types";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export type AssetTypes = Unit[] | Parking[] | Storage[];

const assetFetchAction = (asset: BuildingAsset) => {
  if (asset === BuildingAsset.storage) return fetchBuildingStorages;
  if (asset === BuildingAsset.parking) return fetchBuildingParkings;

  return fetchBuildingUnits;
};

export default function useBuildingAsset() {
  const { assetPage, setAssetPage, setCurrentAssets, currentAssets } =
    useAssetManagement();
  const { token } = useAppSelector((state) => state.auth.value);
  const { id: buildingId } = useParams();

  const fetchAssets = useCallback(async () => {
    try {
      setCurrentAssets(
        await assetFetchAction(assetPage)(
          buildingId as string,
          token as string,
        ),
      );
    } catch (error) {
      toast.error((error as Error).message);
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
  };
}
