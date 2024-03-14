import z, { object, TypeOf, number } from "zod";

export const unitSchema = object({
  unitNumber: z.coerce
    .number({
      required_error: "Unit number is required",
      invalid_type_error: "Unit number must be a number",
    })
    .positive({ message: "Unit number must be a positive number" }),
  isOccupiedByRenter: z
    .enum(["yes", "no"])
    .transform((value) => value === "yes"),
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
