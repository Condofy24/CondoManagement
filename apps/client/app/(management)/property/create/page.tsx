"use client";

import PropertyFormInputs from "@/app/components/form/property-form-inputs";
import ButtonLoadingSpinner from "@/app/components/loader/ButtonLoaderSpinner";
import { cn } from "@/lib/utils";
import { TPropertySchema, propertySchema } from "@/lib/validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createBuilding } from "@/actions/management-actions";

export default function PropertyCreationPage() {
  const [loading, setLoading] = useState(false);
  const [propertyFile, setPropertyFile] = useState<File | null>(null);
  const [propertyFileError, setPropertyFileError] = useState<string | null>(
    null,
  );
  const router = useRouter();

  const { token, admin } = useAppSelector((state) => state.auth.value);

  const onSubmit = async (data: TPropertySchema) => {
    if (propertyFile) {
      setLoading(true);
      try {
        await createBuilding(
          admin?.companyId as string,
          data,
          propertyFile,
          token as string,
        );
        toast.success("Property created successfully");
        router.push("/dashboard");
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setLoading(false);
      }
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TPropertySchema>({
    resolver: zodResolver(propertySchema),
  });

  return (
    <div className="flex flex-col items-center my-20">
      <h2 className="text-2xl text-center font-bold tracking-tight">
        Create a New Property
      </h2>
      <form
        className="w-full max-w-md text-primary"
        onSubmit={handleSubmit(onSubmit)}
      >
        <PropertyFormInputs
          register={register}
          errors={errors}
          propertyFile={{
            setPropertyFile,
            propertyFileError,
            setPropertyFileError,
          }}
        />
        <div className="mt-4 rounded-lg border-4 border-grey p-1 ">
          <button
            disabled={loading}
            type="submit"
            className={cn(
              `bg-secondary text-secondary w-full transform rounded-lg px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-300 focus:outline-none focus:ring focus:ring-opacity-50 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`,
            )}
          >
            {loading ? (
              <ButtonLoadingSpinner loadingText={"loading"} />
            ) : (
              <span className="text-green-500">Create</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
