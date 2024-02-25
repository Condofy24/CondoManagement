import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";

type AddAssetDialogProps = {
  assetName: string;
};

function AddAssetDialog({ assetName }: AddAssetDialogProps) {
  return (
    <Dialog>
      <DialogTrigger>+ Add {assetName}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fill this form and submit</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddAssetDialog;
