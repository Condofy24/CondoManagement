"use client";

import PropertyFormInputs from "@/app/components/form/property-form-inputs";
import ButtonLoadingSpinner from "@/app/components/loader/ButtonLoaderSpinner";
import { cn } from "@/lib/utils";
import { TPropertySchema, propertySchema } from "@/lib/validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "@/redux/services/auth-service";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";

const SignUpNew = () => {
  const [loading, setLoading] = useState(false);
  const [propertyFile, setPropertyFile] = useState<File | null>(null);
  const [propertyFileError, setPropertyFileError] = useState<string | null>(
    null,
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TPropertySchema>({
    resolver: zodResolver(propertySchema),
  });

  const onSubmit = async (data: TPropertySchema) => {
    setLoading(true);

    if (propertyFile) {
      //SERVICE CALL
      //dispatch(registerUser({ ...data, profileFile, role: "3" }));
      //router.push("/login");
    } else {
      setPropertyFileError("Property File is required");
    }

    setLoading(false);
  };

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
};

export default SignUpNew;
