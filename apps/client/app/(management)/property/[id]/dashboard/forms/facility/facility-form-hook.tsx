import { TFacilitySchema, facilitySchema } from "@/lib/unit-validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAssetManagement } from "@/context/asset-management-context";
import toast from "react-hot-toast";
import { createFacility, updateFacility } from "@/actions/management-actions";
import { useAppSelector } from "@/redux/store";
import { useParams } from "next/navigation";
import UseAssets from "../../manage-building-assets-hook";
import { UseFormRegister, FieldErrors } from "react-hook-form";

export type FacilityRegister = UseFormRegister<{
  fees: number;
  name: string;
  items: (
    | {
        openingTime: string;
        closingTime: string;
      }
    | undefined
  )[];
}>;

export type FacilityErrors = FieldErrors<{
  fees: number;
  name: string;
  items: {
    openingTime: string;
    closingTime: string;
  }[];
}>;

export default function useFacilityForm() {
  const { token } = useAppSelector((state) => state.auth.value);
  const { setShowDialog, mode } = useAssetManagement();
  const { fetchAssets } = UseAssets();

  const buildingId = useParams().id;

  const form = useForm<TFacilitySchema>({
    resolver: zodResolver(facilitySchema),
  });

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
  } = form;

  const onSubmit = async (data: TFacilitySchema) => {
    try {
      if (mode == "create") {
        console.log("first");
        await createFacility(buildingId as string, data, token as string);
        toast.success(`Facility created successfully`);
      } else {
        await updateFacility(buildingId as string, data, token as string);
        toast.success(`Facility updated successfully`);
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
    form,
  };
}
