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
  const [propertyPic, setPropertyPic] = useState<File | null>(null);
  const [propertyPicError, setPropertyPicError] = useState<string | null>(null);
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

    if (propertyPic) {
      //SERVICE CALL
      //dispatch(registerUser({ ...data, profilePic, role: "3" }));
      //router.push("/login");
    } else {
      setPropertyPicError("Profile picture is required");
    }

    setLoading(false);
  };

  return (
    <>
    <div className="flex flex-1 justify-center items-center p-4">
    <div className="w-full max-w-md text-primary">
    <h2 className="text-2xl font-bold tracking-tight">Create a New Property</h2>
    <form
      className="w-full max-w-md text-primary"
      onSubmit={handleSubmit(onSubmit)}
    >
      <PropertyFormInputs
        register={register}
        errors={errors}
        propertyPic={{ setPropertyPic, propertyPicError, setPropertyPicError }}
      />
      <div className="mt-4">
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
            <span>Create</span>
          )}
        </button>
      </div>
    </form>
    </div>
    </div>
  </>
  );
};

export default SignUpNew;
