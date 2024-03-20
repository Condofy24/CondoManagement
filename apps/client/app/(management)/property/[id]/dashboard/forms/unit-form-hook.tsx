import { createUnit, updateUnit } from "@/actions/management-actions";
import { Mode, useAssetManagement } from "@/context/asset-management-context";
import { TUnitSchema, unitSchema } from "@/lib/unit-validation-schemas";
import { useAppSelector } from "@/redux/store";
import { Asset, Unit } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import UseAssets from "../manage-building-assets-hook";

const defaultValues = (mode: Mode, asset: Asset | null) => {
  if (!asset || mode === "create")
    return {
      unitNumber: "",
      isOccupiedByRenter: false,
      fees: "",
      size: "",
    };

  const unit = asset as Unit;

  return {
    unitNumber: unit.unitNumber,
    isOccupiedByRenter: unit.isOccupiedByRenter,
    fees: unit.fees,
    size: unit.size,
  };
};

export default function useUnitForm() {
  const buildingId = useParams().id;
  const { token } = useAppSelector((state) => state.auth.value);
  const { mode, setShowDialog, asset } = useAssetManagement();
  const { fetchAssets } = UseAssets();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<TUnitSchema>({
    resolver: zodResolver(unitSchema),
    defaultValues: defaultValues(mode, asset) as TUnitSchema,
  });

  const onSubmit = async (data: TUnitSchema) => {
    try {
      if (mode === "edit") {
        await updateUnit((asset as Unit).id, data, token as string);
        toast.success("Unit updated successfully");
      } else {
        await createUnit(buildingId as string, data, token as string);
        toast.success("Unit created successfully");
      }

      fetchAssets();
      setShowDialog(false);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isDirty,
  };
}
