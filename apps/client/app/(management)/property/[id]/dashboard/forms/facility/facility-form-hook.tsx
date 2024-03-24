import { TFacilitySchema, facilitySchema } from "@/lib/unit-validation-schemas";
import { Asset, BuildingAsset, Parking, Storage } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mode, useAssetManagement } from "@/context/asset-management-context";
import toast from "react-hot-toast";
import { createFacility, updateFacility } from "@/actions/management-actions";
import { useAppSelector } from "@/redux/store";
import { useParams } from "next/navigation";
import UseAssets from "../../manage-building-assets-hook";
import { useEffect, useState } from "react";

export default function useFacilityForm() {
  const [duration, setDuration] = useState<number>(0);
  const { token } = useAppSelector((state) => state.auth.value);
  const { setShowDialog, mode } = useAssetManagement();
  const { fetchAssets } = UseAssets();

  const buildingId = useParams().id;

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<TFacilitySchema>({
    resolver: zodResolver(facilitySchema),
  });
  console.log(getValues());

  const watchOpeningHours = watch("openingHours");
  const watchClosingHours = watch("closingHours");

  const getDuration = () => {
    if (!watchOpeningHours || !watchClosingHours) return 0;

    let date1 = new Date(`01/01/2001 ${watchOpeningHours}:00`);
    let date2 = new Date(`01/01/2001 ${watchClosingHours}:00`);

    return ((date2.getTime() - date1.getTime()) / 1000 / 60 / 60).toFixed(2);
  };

  const updateDuration = () => {
    const newDuration = getDuration();
    setDuration(newDuration as number);
    setValue("duration", newDuration as number, { shouldDirty: true });
  };

  useEffect(() => {
    updateDuration();
  }, [watchOpeningHours, watchClosingHours]);

  const onSubmit = async (data: TFacilitySchema) => {
    try {
      if (mode == "create") {
        await createFacility(buildingId[0], data, token as string);
        toast.success(`Facility created successfully`);
      } else {
        await updateFacility(buildingId[0], data, token as string);
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
    duration,
  };
}
