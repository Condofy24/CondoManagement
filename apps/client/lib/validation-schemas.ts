import { object, string, number, TypeOf } from "zod";

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
export const ACCEPTED_FILE_TYPES = ["image/png", "image/jpg", "image/jpeg"];

export const unitKeySchema = object({
  unitKey: string().min(8, "key must be at least 8 characters"),
});

export type TUnitKeySchema = TypeOf<typeof unitKeySchema>;

export const signupSchema = object({
  email: string().email({ message: "A valid email is required" }),
  name: string()
    .min(3, { message: "Name must be at least 3 character long" })
    .max(20, "Name cannot exceed 20 characters"),
  phoneNumber: string()
    .min(10, "Phone number must be valid")
    .max(10, { message: "Phone number must be valid" }),
  password: string()
    .min(8, "Password must contain at least 8 characters")
    .max(20, "Password cannot exceed 20 characters"),
});

export const createEmployeeSchema = object({
  email: string().email({ message: "A valid email is required" }),
  name: string()
    .min(3, { message: "Name must be at least 3 character long" })
    .max(20, "Name cannot exceed 20 characters"),
  phoneNumber: string()
    .min(10, "Phone number must be valid")
    .max(10, { message: "Phone number must be valid" }),
  role: number({
    required_error: "Role is required",
  }),
});

export type TCreateEmployeeSchema = TypeOf<typeof createEmployeeSchema>;

export type TSignupSchema = TypeOf<typeof signupSchema>;

export const residentSignupSchema = signupSchema.and(unitKeySchema);

export type TResidentSignupSchema = TypeOf<typeof residentSignupSchema>;

export const managerSignupSchema = signupSchema.and(
  object({
    company: string()
      .min(3, { message: "Name must contain at least 3 characters" })
      .max(20, "Name cannot exceed 20 characters"),
    address: string()
      .min(10, { message: "Address must contain at least 10 characters" })
      .max(50, "Address cannot exceed 20 characters"),
  })
);

export type TManagerSignupSchema = TypeOf<typeof managerSignupSchema>;

export const loginSchema = object({
  email: string().email({ message: "A valid email is required" }),
  password: string()
    .min(8, "Password must contain at least 8 characters")
    .max(20, "Password cannot exceed 20 characters"),
});

export type TLoginSchema = TypeOf<typeof loginSchema>;

export const propertySchema = object({
  name: string()
    .min(3, { message: "Name of property must be at least 3 characters long" })
    .max(20, { message: "Name of property cannot exceed 20 characters" }),
  address: string()
    .min(10, { message: "Address must contain at least 10 characters" })
    .max(50, "Address cannot exceed 20 characters"),
});

export type TPropertySchema = TypeOf<typeof propertySchema>;
