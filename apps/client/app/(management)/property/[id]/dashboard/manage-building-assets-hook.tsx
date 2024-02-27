import { BuildingAssetType } from "@/types";
import { useState } from "react";

export default function useBuildingAsset() {
  const [assetPage, setAssetPage] = useState<BuildingAssetType>(
    BuildingAssetType.unit,
  );
  return { assetPage, setAssetPage };
}
