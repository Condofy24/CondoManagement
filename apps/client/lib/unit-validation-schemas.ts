import { object, string, TypeOf, number } from "zod";

export const unitSchema = object({
  unitNumber: string({ required_error: "Unit number is required" }),
  fees: number({ required_error: "Unit fees is required" }).min(0, {
    message: "Fees must be at above 0",
  }),
  size: number({ required_error: "Unit size is required" }).min(0, {
    message: "Size must be at above 0",
  }),
});

export type TUnitSchema = TypeOf<typeof unitSchema>;

export const assetSchema = object({
  assetNumber: string({ required_error: "Asset number is required" }),
  fees: number({ required_error: "Asset fees is required" }).min(0, {
    message: "Fees must be at above 0",
  }),
});

export type TAssetSchema = TypeOf<typeof assetSchema>;
