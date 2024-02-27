import { TAssetSchema, assetSchema } from "@/lib/unit-validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

export default function useAssetForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAssetSchema>({
    resolver: zodResolver(assetSchema),
  });

  const onSubmit = (data: TAssetSchema) => {
    console.log(data);
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
}
