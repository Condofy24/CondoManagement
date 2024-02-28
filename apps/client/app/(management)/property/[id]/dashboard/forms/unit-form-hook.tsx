import { TUnitSchema, unitSchema } from "@/lib/unit-validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function useUnitForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TUnitSchema>({
    resolver: zodResolver(unitSchema),
  });

  const onSubmit = (data: TUnitSchema) => {
    console.log(data);
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
}
