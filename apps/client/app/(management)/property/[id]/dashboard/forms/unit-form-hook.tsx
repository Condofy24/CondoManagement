import { API_URL } from "@/global";
import { TUnitSchema, unitSchema } from "@/lib/unit-validation-schemas";
import { useAppSelector } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function useUnitForm() {
  const isEditing = false;
  const buildingId = useParams().id;
  const { token } = useAppSelector((state) => state.auth.value);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TUnitSchema>({
    resolver: zodResolver(unitSchema),
  });

  const onSubmit = async (data: TUnitSchema) => {
    const userData = {
      ...data,
      isOccupiedByRenter: getIsOccupiesByRenter(data.isOccupiedByRenter),
    };

    if (isEditing) {
      // Edit unit
    } else {
      const res = await axios.post(`${API_URL}/unit/${buildingId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201) {
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
    isEditing,
  };
}

const getIsOccupiesByRenter = (isOccupiedByRenter: string): boolean => {
  return isOccupiedByRenter === "Yes";
};
