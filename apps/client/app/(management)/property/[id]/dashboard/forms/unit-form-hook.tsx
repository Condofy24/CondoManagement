import { createUnit } from "@/actions/management-actions";
import { useAssetManagement } from "@/context/asset-management-context";
import { TUnitSchema, unitSchema } from "@/lib/unit-validation-schemas";
import { useAppSelector } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function useUnitForm() {
  const buildingId = useParams().id;
  const { token } = useAppSelector((state) => state.auth.value);
  const { mode } = useAssetManagement();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TUnitSchema>({
    resolver: zodResolver(unitSchema),
  });

  const onSubmit = async (data: TUnitSchema) => {
    if (mode === "edit") {
      // Edit unit
    } else {
      const res = await createUnit(buildingId as string, data, token as string);

      if (res === 201) {
        toast.success("Unit created successfully");
      } else {
        toast.error("Failed to create unit");
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
