import z, { object, TypeOf, number, ZodArray } from "zod";

export const unitSchema = object({
  unitNumber: z.coerce
    .number({
      required_error: "Unit number is required",
      invalid_type_error: "Unit number must be a number",
    })
    .positive({ message: "Unit number must be a positive number" }),
  isOccupiedByRenter: z
    .enum(["yes", "no"])
    .transform((value: any) => value === "yes"),
  fees: number({ required_error: "Unit fees is required" }).min(0, {
    message: "Fees must be at above 0",
  }),
  size: number({ required_error: "Unit size is required" }).min(0, {
    message: "Size must be at above 0",
  }),
});

export type TUnitSchema = TypeOf<typeof unitSchema>;

export const addPaymentSchema = object({
  amount: z.coerce
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive({ message: "Paid amount must be a positive number" }),
});

export type TAddPaymentSchema = TypeOf<typeof addPaymentSchema>;

export const assetSchema = object({
  assetNumber: z.coerce
    .number({
      required_error: "Asset number is required",
      invalid_type_error: "Asset number must be a number",
    })
    .positive({ message: "Asset number must be a positive number" }),
  fees: number({
    required_error: "Asset fees is required",
    invalid_type_error: "Asset fees must be a number",
  }).min(0, {
    message: "Fees must be at above 0",
  }),
});

export type TAssetSchema = TypeOf<typeof assetSchema>;

const workingTimesSchema = object({
  openingTime: z
    .string({ required_error: "Opening hours is required" })
    .regex(
      new RegExp("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"),
      "Time format invalid use HH:MM",
    ),
  closingTime: z
    .string({ required_error: "Closing hours is required" })
    .regex(
      new RegExp("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"),
      "Time format invalid use HH:MM",
    ),
}).optional();

export const facilitySchema = object({
  name: z.string({ required_error: "Facility name is required" }),
  fees: number({
    required_error: "Facility fees is required",
    invalid_type_error: "Facility fees must be a number",
  }).min(0, {
    message: "Fees must be at above 0",
  }),
  duration: number({ required_error: "Duration is required" }).min(0, {
    message: "Duration must be at least 0",
  }),
  items: z.array(workingTimesSchema).min(1),
});

export type TFacilitySchema = TypeOf<typeof facilitySchema>;
