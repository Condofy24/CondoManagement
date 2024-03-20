import { addNewPayment } from "@/actions/management-actions";
import { useAssetManagement } from "@/context/asset-management-context";
import {
  TAddPaymentSchema,
  addPaymentSchema,
} from "@/lib/unit-validation-schemas";
import { useAppSelector } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import UseAssets from "../manage-building-assets-hook";

export default function useAddPaymentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAddPaymentSchema>({
    resolver: zodResolver(addPaymentSchema),
  });
  const { asset, setShowPaymentDialog, setAsset } = useAssetManagement();
  const { fetchAssets } = UseAssets();
  const { token } = useAppSelector((state) => state.auth.value);

  const onSubmit = async (data: TAddPaymentSchema) => {
    if (asset?.id) {
      try {
        await addNewPayment(asset?.id, data, token as string);
        toast.success("Payment recorded successfully");
        await fetchAssets();
        setShowPaymentDialog(false);
        setAsset(null);
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
}
