import { fetchAssets } from "@/actions/management-actions";
import { useAppSelector } from "@/redux/store";
import { BuildingAssetType, Parking, Storage, Unit } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export type AssetTypes = Unit[] | Parking[] | Storage[];

export default function useBuildingAsset() {
  const [assetPage, setAssetPage] = useState<BuildingAssetType>(
    BuildingAssetType.unit,
  );
  const { token } = useAppSelector((state) => state.auth.value);
  const { id: buildingId } = useParams();
  const [assets, setAssets] = useState<AssetTypes>([]);

  useEffect(() => {
    const getAssetsByPage = async () => {
      try {
        const data = await fetchAssets(
          assetPage,
          buildingId as string,
          token as string,
        );
        setAssets(data);
      } catch (error) {
        toast.error("Error fetching assets: " + error);
      }
    };

    getAssetsByPage();
  }, [assetPage, buildingId, token]);

  return { assetPage, setAssetPage, assets };
}
