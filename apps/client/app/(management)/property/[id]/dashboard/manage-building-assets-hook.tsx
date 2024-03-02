import { API_URL } from "@/global";
import { useAppSelector } from "@/redux/store";
import { BuildingAssetType, Parking, Storage, Unit } from "@/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export type AssetTypes = Unit[] | Parking[] | Storage[];

export default function useBuildingAsset() {
  const [assetPage, setAssetPage] = useState<BuildingAssetType>(
    BuildingAssetType.unit
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
          token as string
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

const fetchAssets = async (
  assetPage: BuildingAssetType,
  buildingId: string,
  token: string
): Promise<AssetTypes> => {
  switch (assetPage) {
    case BuildingAssetType.unit:
      const { data: unitData } = await axios.get<Unit[]>(
        `${API_URL}/unit/${buildingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return unitData;

    case BuildingAssetType.parking:
      const { data: parkingData } = await axios.get<Parking[]>(
        `${API_URL}/parking/${buildingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return parkingData;

    case BuildingAssetType.storage:
      const { data: storageData } = await axios.get<Storage[]>(
        `${API_URL}/storage/${buildingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return storageData;

    default:
      throw new Error("Invalid asset type");
  }
};
