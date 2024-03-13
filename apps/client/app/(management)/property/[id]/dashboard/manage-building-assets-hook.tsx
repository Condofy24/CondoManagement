import { fetchAssets } from "@/actions/management-actions";
import { useAssetManagement } from "@/context/asset-management-context";
import { useAppSelector } from "@/redux/store";
import { BuildingAssetType, Parking, Storage, Unit } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export type AssetTypes = Unit[] | Parking[] | Storage[];

export default function useBuildingAsset() {
  const [assetPage, setAssetPage] = useState<BuildingAssetType>(
    BuildingAssetType.unit
  );
  const { setCurrentAssets, currentAssets } = useAssetManagement();
  const { token } = useAppSelector((state) => state.auth.value);
  const { id: buildingId } = useParams();

  const getAssetsByPage = async () => {
    try {
      const data = await fetchAssets(
        assetPage,
        buildingId as string,
        token as string
      );
      setCurrentAssets(data as AssetTypes);
    } catch (error) {
      toast.error("Error fetching assets: " + error);
    }
  };

  useEffect(() => {
    getAssetsByPage();
  }, [assetPage, buildingId, token]);

  return { assetPage, getAssetsByPage, setAssetPage, assets: currentAssets };
}
