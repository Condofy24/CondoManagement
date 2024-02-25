import {
  TCreateUnitSchema,
  createUnitSchema,
} from "@/lib/unit-validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function UseCreateUnit() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCreateUnitSchema>({
    resolver: zodResolver(createUnitSchema),
  });

  const onSubmit = (data: TCreateUnitSchema) => {
    console.log("first")
    console.log(data);
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
}
