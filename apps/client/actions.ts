import { TPropertySchema } from "./lib/validation-schemas";
import axios from "axios";
import { API_URL } from "@/global";
import { BuildingAssetType, Parking, Unit, Storage } from "./types";
import { AssetTypes } from "./app/(management)/property/[id]/dashboard/manage-building-assets-hook";

export async function createProperty(
  companyId: string,
  buildingData: TPropertySchema,
  file: File,
  token: string,
) {
  try {
    await axios.post(
      `${API_URL}/building/${companyId}`,
      { ...buildingData, file },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
  } catch (error: any) {
    return new Error("could not create specified property");
  }
}

export async function fetchProperties(companyId: string, token: string) {
  try {
    const response = await axios.get(`${API_URL}/building/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    return new Error("could not fetch properties");
  }
}

export const fetchAssets = async (
  assetPage: BuildingAssetType,
  buildingId: string,
  token: string,
): Promise<AssetTypes> => {
  switch (assetPage) {
    case BuildingAssetType.unit:
      const { data: unitData } = await axios.get<Unit[]>(
        `${API_URL}/unit/${buildingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return unitData;

    case BuildingAssetType.parking:
      const { data: parkingData } = await axios.get<Parking[]>(
        `${API_URL}/parking/${buildingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return parkingData;

    case BuildingAssetType.storage:
      const { data: storageData } = await axios.get<Storage[]>(
        `${API_URL}/storage/${buildingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return storageData;

    default:
      throw new Error("Invalid asset type");
  }
};
