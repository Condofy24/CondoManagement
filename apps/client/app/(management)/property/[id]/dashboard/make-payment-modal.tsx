import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { useAssetManagement } from "@/context/asset-management-context";
import AddPaymentForm from "./forms/add-payment-form";
import { Unit } from "@/types";

export default function AddPaymentModal() {
  const { showPaymentDialog, setShowPaymentDialog, asset } =
    useAssetManagement();

  return (
    <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add a New Payment to {(asset as Unit)?.unitNumber}
          </DialogTitle>
        </DialogHeader>
        {AddPaymentForm()}
      </DialogContent>
    </Dialog>
  );
}
