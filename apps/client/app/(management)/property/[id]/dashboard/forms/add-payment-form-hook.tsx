import {
  TAddPaymentSchema,
  addPaymentSchema,
} from "@/lib/unit-validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function useAddPaymentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAddPaymentSchema>({
    resolver: zodResolver(addPaymentSchema),
  });

  const onSubmit = (data: TAddPaymentSchema) => {
    console.log(data);
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
}
