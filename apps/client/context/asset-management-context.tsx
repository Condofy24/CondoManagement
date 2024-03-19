import { AssetTypes } from "@/app/(management)/property/[id]/dashboard/manage-building-assets-hook";
import { Asset, BuildingAsset } from "@/types";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export type Mode = "create" | "edit";

type AssetManagementContextType = {
  showDialog: boolean;
  showPaymentDialog: boolean;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
  setShowPaymentDialog: Dispatch<SetStateAction<boolean>>;
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
  asset: Asset | null;
  setAsset: Dispatch<SetStateAction<Asset | null>>;
  currentAssets: AssetTypes;
  setCurrentAssets: Dispatch<SetStateAction<AssetTypes>>;
  assetPage: BuildingAsset;
  setAssetPage: Dispatch<SetStateAction<BuildingAsset>>;
} | null;

type AssetManagementContextProviderProps = {
  children: React.ReactNode;
};

export const assetManagementContext =
  createContext<AssetManagementContextType>(null);

export default function AssetManagementContextProvider({
  children,
}: AssetManagementContextProviderProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [currentAssets, setCurrentAssets] = useState<AssetTypes>([]);
  const [mode, setMode] = useState<Mode>("create");
  const [assetPage, setAssetPage] = useState<BuildingAsset>(BuildingAsset.unit);

  return (
    <assetManagementContext.Provider
      value={{
        showDialog,
        setShowDialog,
        mode,
        setMode,
        asset,
        currentAssets,
        setCurrentAssets,
        showPaymentDialog,
        setShowPaymentDialog,
        setAsset,
        assetPage,
        setAssetPage,
      }}
    >
      {children}
    </assetManagementContext.Provider>
  );
}

export const useAssetManagement = () => {
  const context = useContext(assetManagementContext);

  if (context === null) {
    throw new Error(
      "useAssetManagement must be used within an AssetManagementContextProvider",
    );
  }

  return context;
};
