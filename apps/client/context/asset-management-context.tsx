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
  showAmenityDialog: boolean;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
  setShowPaymentDialog: Dispatch<SetStateAction<boolean>>;
  setShowAmenityDialog: Dispatch<SetStateAction<boolean>>;
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
  asset: Asset | null;
  setAsset: Dispatch<SetStateAction<Asset | null>>;
  currentAssets: AssetTypes;
  setCurrentAssets: Dispatch<SetStateAction<AssetTypes>>;
  assetPage: BuildingAsset;
  setAssetPage: Dispatch<SetStateAction<BuildingAsset>>;

  isFetching: boolean;
  setIsFetching: Dispatch<SetStateAction<boolean>>;
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
  const [showAmenityDialog, setShowAmenityDialog] = useState(false);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [currentAssets, setCurrentAssets] = useState<AssetTypes>([]);
  const [mode, setMode] = useState<Mode>("create");
  const [assetPage, setAssetPage] = useState<BuildingAsset>(BuildingAsset.unit);
  const [isFetching, setIsFetching] = useState(false);

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
        showAmenityDialog,
        setShowAmenityDialog,
        setAsset,
        assetPage,
        setAssetPage,
        isFetching,
        setIsFetching,
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
