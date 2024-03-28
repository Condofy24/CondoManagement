import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import FormFieldError from "@/app/components/form/form-field-error";
import { useAssetManagement } from "@/context/asset-management-context";
import useFacilityForm from "./facility-form-hook";
import { CheckboxReactHookFormMultiple } from "./days-checkbox";

export default function FacilityForm() {
  const { mode, setShowDialog, asset, setAsset } = useAssetManagement();
  const { register, handleSubmit, errors, onSubmit, isDirty, form } =
    useFacilityForm(asset);
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
        <label className="block text-sm font-bold mb-2" htmlFor="duration">
          Duration (min)
        </label>
        <Input
          id="duration"
          {...register("duration", { valueAsNumber: true })}
          placeholder="Duration of block in minutes"
          className="dark:bg-white dark:text-black"
        />
        <FormFieldError fieldError={errors.fees} />
      </div>

      <CheckboxReactHookFormMultiple
        errors={errors}
        register={register}
        form={form}
      />

      <div className="flex flex-row justify-center gap-10">
        <Button
          type="button"
          onClick={() => {
            setShowDialog(false);
            setAsset(null);
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!isDirty}>
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </Button>
      </div>
    </form>
  );
}
