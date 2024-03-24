import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import FormFieldError from "@/app/components/form/form-field-error";
import { useAssetManagement } from "@/context/asset-management-context";
import useFacilityForm from "./facility-form-hook";

export default function FacilityForm() {
  const { mode, setShowDialog } = useAssetManagement();
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isDirty,
    duration,
  } = useFacilityForm();

  return (
    <form className="p-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="fees">
          {`Facility Name`}
        </label>
        <Input
          id="assetNumber"
          {...register("name")}
          placeholder={`Gym Facility`}
          className="dark:bg-white dark:text-black"
        />
        <FormFieldError fieldError={errors.name} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="fees">
          Fees ($CAD)
        </label>
        <Input
          id="fees"
          {...register("fees", { valueAsNumber: true })}
          placeholder="Fees"
          className="dark:bg-white dark:text-black"
        />
        <FormFieldError fieldError={errors.fees} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="openingHours">
          Opening Hours
        </label>
        <Input
          id="openingHours"
          {...register("openingHours")}
          placeholder="HH:MM"
          className="dark:bg-white dark:text-black"
        />
        <FormFieldError fieldError={errors.openingHours} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="closingHours">
          Closing Hours
        </label>
        <Input
          id="closingHours"
          {...register("closingHours")}
          placeholder="HH:MM"
          className="dark:bg-white dark:text-black"
        />
        <FormFieldError fieldError={errors.closingHours} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="duration">
          Duration
        </label>
        <Input
          id="duration"
          value={duration}
          {...register("duration", { valueAsNumber: true })}
          className="dark:bg-white dark:text-black"
          disabled
        />
        <FormFieldError fieldError={errors.duration} />
      </div>
      <div className="flex flex-row justify-center gap-10">
        <Button type="button" onClick={() => setShowDialog(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isDirty}>
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </Button>
      </div>
    </form>
  );
}
