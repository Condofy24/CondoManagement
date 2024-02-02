import { object, string, z, TypeOf } from "zod";

export const signupSchema = object({
  email: string().email({ message: "A valid email is required" }),
  username: string()
    .min(3, { message: "Username must be at least 3 character long" })
    .max(20, "Username cannot exceed 20 characters"),
  phone: string()
    .min(7, "Phone number must be valid")
    .max(12, { message: "Phone number must be valid" }),
  // profilePicture: z
  //   .instanceof(File)
  //   .optional()
  //   .refine((file) => {
  //     return !file || file.size <= MAX_UPLOAD_SIZE;
  //   }, "Picture size must be less than 3MB")
  //   .refine((file) => {
  //     return file && ACCEPTED_FILE_TYPES.includes(file.type);
  //   }, "Picture must be a PNG"),
  password: string()
    .min(8, "Password must contain at least 8 characters")
    .max(20, "Password cannot exceed 20 characters"),
});

export type TSignupSchema = TypeOf<typeof signupSchema>;

export const managerSignupSchema = signupSchema.and(
  object({
    company: string()
      .min(3, { message: "Name must contain at least 3 characters" })
      .max(20, "Name cannot exceed 20 characters"),
    address: string()
      .min(10, { message: "Address must contain at least 10 characters" })
      .max(50, "Address cannot exceed 20 characters"),
  }),
);

export type TManagerSignupSchema = TypeOf<typeof managerSignupSchema>;
