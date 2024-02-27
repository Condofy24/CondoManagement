import { BuildingAsset, Parking, Unit } from "@/types";
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
  setShowDialog: Dispatch<SetStateAction<boolean>>;
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
  asset: Asset | null;
  setAsset: Dispatch<SetStateAction<Asset>>;
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
  const [asset, setAsset] = useState<BuildingAsset | null>(null);
  const [mode, setMode] = useState<Mode>("create");

  return (
    <assetManagementContext.Provider
      value={{
        showDialog,
        setShowDialog,
        mode,
        setMode,
        asset,
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
