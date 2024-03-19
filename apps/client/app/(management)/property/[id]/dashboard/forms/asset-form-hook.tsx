import { TAssetSchema, assetSchema } from "@/lib/unit-validation-schemas";
import { Asset, BuildingAsset, Parking, Storage } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mode, useAssetManagement } from "@/context/asset-management-context";
import toast from "react-hot-toast";
import {
  createParking,
  createStorage,
  updateParking,
  updateStorage,
} from "@/actions/management-actions";
import { useAppSelector } from "@/redux/store";
import { useParams } from "next/navigation";
import UseAssets from "../manage-building-assets-hook";

const defaultValues = (type: BuildingAsset, asset: Asset | null) => {
  if (!asset) return { assetNumber: "", fees: "" };

  if (type === BuildingAsset.parking) {
    return { assetNumber: (asset as Parking).parkingNumber, fees: asset.fees };
  } else {
    return { assetNumber: (asset as Storage).storageNumber, fees: asset.fees };
  }
};

const updateAction = (type: BuildingAsset) => {
  if (type === BuildingAsset.parking) return updateParking;
  else return updateStorage;
};

const createAction = (type: BuildingAsset) => {
  if (type === BuildingAsset.parking) return createParking;
  else return createStorage;
};

export default function useAssetForm(type: BuildingAsset, asset: Asset | null) {
  const { token } = useAppSelector((state) => state.auth.value);
  const { setShowDialog, mode, currentAssets } = useAssetManagement();
  const { fetchAssets } = UseAssets();

  const buildingId = useParams().id;

  console.log(currentAssets);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<TAssetSchema>({
    resolver: zodResolver(assetSchema),
    defaultValues: defaultValues(type, asset) as TAssetSchema,
  });

  const onSubmit = async (data: TAssetSchema) => {
    try {
      if (mode == "create") {
        await createAction(type)(buildingId as string, data, token as string);
        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} created successfully`,
        );
      } else {
        await updateAction(type)((asset as Asset).id, data, token as string);
        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`,
        );
      }
      setShowDialog(false);
      fetchAssets();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isDirty,
    onSubmit,
  };
}
