import { object, string, z, TypeOf, number } from "zod";

export const createUnitSchema = object({
  name: string()
    .min(3, { message: "Name must be at least 3 character long" })
    .max(20, "Name cannot exceed 20 characters"),
  fees: number().min(100, { message: "Fees must be at least 100" }),
  size: number().min(0, { message: "Size must be at least 0" }),
});

export type TCreateUnitSchema = TypeOf<typeof createUnitSchema>;

export const createParkingSchema = object({
  fees: number().min(0, { message: "Fees must be at least 0.01" }),
});

export type TCreateParkingSchema = TypeOf<typeof createParkingSchema>;
