import { createRequest } from "@/actions/resident-actions";
import { TRequestSchema, requestSchema } from "@/lib/unit-validation-schemas";
import { useAppSelector } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function useRequest() {
  const { token } = useAppSelector((state) => state.auth.value);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TRequestSchema>({
    resolver: zodResolver(requestSchema),
  });

  const onSubmit = async (data: TRequestSchema) => {
    try {
      await createRequest(data.unitNumber as string, data, token as string);
      toast.success(`Facility created successfully`);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    setValue,
  };
}
