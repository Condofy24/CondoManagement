import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { BuildingAsset } from "@/types";
import AssetForm from "./forms/asset/asset-form";
import { useAssetManagement } from "@/context/asset-management-context";
import UnitForm from "./forms/unit/unit-form";
import FacilityForm from "./forms/facility/facility-form";

export default function CreateUpdateAssetModal({
  assetName,
}: {
  assetName: BuildingAsset;
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

const getBuildingAssetForm = (assetName: BuildingAsset) => {
  switch (assetName) {
    case BuildingAsset.unit:
      return <UnitForm />;
    case BuildingAsset.parking:
      return <AssetForm type={BuildingAsset.parking} />;
    case BuildingAsset.storage:
      return <AssetForm type={BuildingAsset.storage} />;
    case BuildingAsset.facility:
      return <FacilityForm />;
  }
};
