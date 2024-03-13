"use client";
import { claimOwnerUnit } from "@/actions/resident-actions";
import FormFieldError from "@/app/components/form/form-field-error";
import ButtonLoadingSpinner from "@/app/components/loader/ButtonLoaderSpinner";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { cn } from "@/lib/utils";
import { TUnitKeySchema, unitKeySchema } from "@/lib/validation-schemas";
import { useAppSelector } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { notFound } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function OwnerPropertiesDashboardPage() {
  const { loggedIn, user, token } = useAppSelector((state) => state.auth.value);

  const isOwner = user?.role === 4;
  if (!loggedIn || !isOwner) {
    return notFound();
  }

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TUnitKeySchema>({
    resolver: zodResolver(unitKeySchema),
  });

  const onSubmit = async (data: TUnitKeySchema) => {
    setLoading(true);

    try {
      await claimOwnerUnit(data, token as string);
      toast.success("Unit claimed");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col p-4 space-y-8 md:p-16 mb-10">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hi {user?.name}</h2>
          <p className="text-muted-foreground">
            Here are the properties you own!
          </p>
        </div>
        <div className="flex items-center mr-16">
          <Card>
            <Popover>
              <PopoverTrigger>
                <Button>Claim Property</Button>
              </PopoverTrigger>
              <PopoverContent>
                <form
                  className="w-full max-w-md text-primary"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="flex flex-col items-start mt-2 mb-2 dark:bg-gray-800 p-4 border-1 shadow-black border-gray-700 bg-gray-200/45 rounded-lg">
                    <div className="flex flex-col w-full">
                      <h2 className=" flex justify-center mb-3 px-3 text-white outline-none font-semibold text-lg text-gray-700/90 dark:text-white/80">
                        Property Key
                      </h2>

                      <div className="flex-grow flex flex-col">
                        <input
                          type="text"
                          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
                          placeholder="Key"
                          {...register("unitKey")}
                        />

                        <FormFieldError fieldError={errors.unitKey} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      disabled={loading}
                      type="submit"
                      className={cn(
                        `bg-secondary text-secondary w-full transform rounded-lg px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-300 focus:outline-none focus:ring focus:ring-opacity-50 ${
                          loading ? "cursor-not-allowed opacity-50" : ""
                        }`,
                        "bg-gray-900 text-white outline-none transition-all hover:scale-105 hover:bg-gray-950 focus:scale-110 active:scale-105 dark:bg-white dark:bg-opacity-10",
                      )}
                    >
                      {loading ? (
                        <ButtonLoadingSpinner loadingText={"loading"} />
                      ) : (
                        <span>Claim</span>
                      )}
                    </button>
                  </div>
                </form>
              </PopoverContent>
            </Popover>
          </Card>
        </div>
      </div>
    </div>
  );
}
