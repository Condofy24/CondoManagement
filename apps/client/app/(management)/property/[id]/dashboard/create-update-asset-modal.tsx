import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { BuildingAssetType } from "@/types";
import AssetForm from "./forms/asset-form";
import { useAssetManagement } from "@/context/asset-management-context";
import UnitForm from "./forms/unit-form";

export default function CreateUpdateAssetModal({
  assetName,
}: {
  assetName: BuildingAssetType;
}) {
  const { showDialog, setShowDialog, mode, setMode, setAsset } =
    useAssetManagement();

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger
        onClick={() => {
          setShowDialog(true);
          setMode("create");
          setAsset(null);
        }}
      >
        + Add {assetName}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? `Create ${assetName}` : `Edit ${assetName}`}
          </DialogTitle>
        </DialogHeader>
        {getBuildingAssetForm(assetName)}
      </DialogContent>
    </Dialog>
  );
}

const getBuildingAssetForm = (assetName: BuildingAssetType) => {
  switch (assetName) {
    case BuildingAssetType.unit:
      return <UnitForm />;
    case BuildingAssetType.parking:
      return <AssetForm assetType={BuildingAssetType.parking} />;
    case BuildingAssetType.storage:
      return <AssetForm assetType={BuildingAssetType.storage} />;
  }
};
