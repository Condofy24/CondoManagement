import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import FormFieldError from "@/app/components/form/form-field-error";
import { useAssetManagement } from "@/context/asset-management-context";
import useFacilityForm from "./facility-form-hook";
import { CheckboxReactHookFormMultiple } from "./days-checkbox";
import { Facility } from "@/types";
import { formatTime } from "../../table-columns/facility-columns";
import {
  TFacilitySchema,
  TWorkingTimesSchema,
} from "@/lib/unit-validation-schemas";

export default function FacilityForm() {
  const { mode, setShowDialog, asset, setAsset } = useAssetManagement();
  const formattedAsset = () => {
    if (asset && (asset as Facility).operationTimes) {
      return {
        ...asset,
        operationTimes: (asset as Facility).operationTimes.map((time) => ({
          weekDay: time.weekDay,
          openingTime: formatTime(time.openingTime as unknown as number),
          closingTime: formatTime(time.closingTime as unknown as number),
        })),
      };
    } else {
      return asset;
    }
  };

  const assetSortedTimes = {
    ...formattedAsset(),
    operationTimes: sortOpeningTimes(
      (formattedAsset() as Facility).operationTimes as TWorkingTimesSchema[],
    ),
  };

  const { register, handleSubmit, errors, onSubmit, isDirty, form } =
    useFacilityForm(assetSortedTimes as TFacilitySchema);
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
        <FormFieldError fieldError={errors.duration} />
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

function sortOpeningTimes(openingTimes: TWorkingTimesSchema[]) {
  const sortedArray = new Array(7); // Create an array of size 7
  openingTimes.forEach((operationTimes) => {
    switch ((operationTimes?.weekDay as unknown as string).toLowerCase()) {
      case "monday":
        sortedArray[0] = { ...operationTimes };
        break;
      case "tuesday":
        sortedArray[1] = { ...operationTimes };
        break;
      case "wednesday":
        sortedArray[2] = { ...operationTimes };
        break;
      case "thursday":
        sortedArray[3] = { ...operationTimes };
        break;
      case "friday":
        sortedArray[4] = { ...operationTimes };
        break;
      case "saturday":
        sortedArray[5] = { ...operationTimes };
        break;
      case "sunday":
        sortedArray[6] = { ...operationTimes };
        break;
      default:
        break; // Do nothing for unknown weekdays
    }
  });
  return sortedArray;
}
