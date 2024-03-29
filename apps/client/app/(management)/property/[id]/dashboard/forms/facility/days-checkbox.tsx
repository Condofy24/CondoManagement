import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/app/components/ui/form";
import FacilityHoursInput from "./facility-hours-input";
import { FacilityRegister, FacilityErrors } from "./facility-form-hook";
import { UseFormReturn } from "react-hook-form";

const days = [
  { id: "0", label: "Monday" },
  { id: "1", label: "Tuesday" },
  { id: "2", label: "Wednesday" },
  { id: "3", label: "Thursday" },
  { id: "4", label: "Friday" },
  { id: "5", label: "Saturday" },
  { id: "6", label: "Sunday" },
] as const;

export type formType = UseFormReturn<
  {
    fees: number;
    name: string;
    duration: number;
    operationTimes: (
      | {
          openingTime: string;
          closingTime: string;
          weekDay?: any;
        }
      | undefined
    )[];
  },
  any,
  undefined
>;

export function CheckboxReactHookFormMultiple({
  errors,
  register,
  form,
}: {
  errors: FacilityErrors;
  register: FacilityRegister;
  form: formType;
}) {
  return (
    <Form {...form}>
      <div className="space-y-8">
        <FormField
          control={form.control}
          name="operationTimes"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Working Days</FormLabel>
                <FormDescription>Select the working days.</FormDescription>
              </div>
              {days.map((day) => (
                <FormField
                  key={day.id}
                  control={form.control}
                  name={`operationTimes.${day.id}`}
                  render={({ field }) => (
                    <FormItem
                      key={day.id}
                      className="flex flex-row space-x-3 space-y-0 items-center"
                    >
                      <Checkbox
                        key={day.id}
                        checked={field.value ? true : false}
                        onCheckedChange={(checked: any) => {
                          field.onChange(checked);
                        }}
                      />
                      <FormLabel className="font-normal">{day.label}</FormLabel>

                      {field.value && (
                        <>
                          <FacilityHoursInput
                            errors={errors}
                            register={register}
                            id={day.id}
                          />
                        </>
                      )}
                    </FormItem>
                  )}
                />
              ))}
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}
