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

const items = [
  { id: "0", label: "Monday" },
  { id: "1", label: "Tuesday" },
  { id: "2", label: "Wednesday" },
  { id: "3", label: "Thursday" },
  { id: "4", label: "Friday" },
  { id: "5", label: "Saturday" },
  { id: "6", label: "Sunday" },
] as const;

export function CheckboxReactHookFormMultiple({
  errors,
  register,
  form,
}: {
  errors: FacilityErrors;
  register: FacilityRegister;
  form: any;
}) {
  return (
    <Form {...form}>
      <div className="space-y-8">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Working Days</FormLabel>
                <FormDescription>Select the working days.</FormDescription>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name={`items.${item.id}`}
                  render={({ field }) => (
                    <FormItem
                      key={item.id}
                      className="flex flex-row space-x-3 space-y-0 items-center"
                    >
                      <Checkbox
                        key={item.id}
                        checked={field.value}
                        onCheckedChange={(checked: any) => {
                          field.onChange(checked);
                        }}
                      />
                      <FormLabel className="font-normal">
                        {item.label}
                      </FormLabel>

                      {field.value && (
                        <>
                          <FacilityHoursInput
                            errors={errors}
                            register={register}
                            id={item.id}
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
