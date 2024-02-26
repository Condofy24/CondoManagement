import CreateAsset from "@/app/(management)/assets/create-asset";
import CreateUnit from "@/app/(management)/assets/create-unit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { AssetType } from "@/types";

export default function AddAssetDialog({
  assetName,
}: {
  assetName: AssetType;
}) {
  return (
    <Dialog>
      <DialogTrigger>+ Add {assetName}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Creating a New {assetName}</DialogTitle>
          {getDescription(assetName)}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

const getDescription = (assetName: AssetType) => {
  switch (assetName) {
    case AssetType.unit:
      return <CreateUnit />;
    case AssetType.parking:
      return <CreateAsset assetType={AssetType.parking} />;
    case AssetType.storage:
      return <CreateAsset assetType={AssetType.storage} />;
  }
};
