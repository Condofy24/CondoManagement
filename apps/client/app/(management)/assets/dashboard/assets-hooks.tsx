import { AssetType } from "@/types";
import { useState } from "react";

export default function UseAssets() {
  const [assetPage, setAssetPage] = useState<AssetType>(AssetType.unit);
  return { assetPage, setAssetPage };
}
