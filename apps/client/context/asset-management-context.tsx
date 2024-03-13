import { AssetTypes } from "@/app/(management)/property/[id]/dashboard/manage-building-assets-hook";
import { BuildingAsset } from "@/types";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type Mode = "create" | "edit";

type AssetManagementContextType = {
  showDialog: boolean;
  showPaymentDialog: boolean;
  setShowDialog: Dispatch<SetStateAction<boolean>>;
  setShowPaymentDialog: Dispatch<SetStateAction<boolean>>;
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
  asset: BuildingAsset | null;
  setAsset: Dispatch<SetStateAction<BuildingAsset | null>>;
  currentAssets: AssetTypes;
  setCurrentAssets: Dispatch<SetStateAction<AssetTypes>>;
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
  const [asset, setAsset] = useState<BuildingAsset | null>(null);
  const [currentAssets, setCurrentAssets] = useState<AssetTypes>([]);
  const [mode, setMode] = useState<Mode>("create");

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
