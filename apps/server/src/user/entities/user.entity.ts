import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { isEmail } from 'class-validator';

/**
 * Defines the schema for the User entity.
 */
export const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: { unique: true },
      validate: [isEmail, 'invalid email'],
    },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: Number, required: true, default: 3 },
    phoneNumber: { type: String, required: true },
    imageUrl: { type: String, required: true },
    imageId: { type: String, required: true },
    companyId: { type: String, required: false },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

/**
 * Represents the User model in the database.
 */
export const UserModel = mongoose.model(
  'User',
  new mongoose.Schema(UserSchema),
);

/**
 * Middleware function that automatically hashes the password before saving it to the database.
 */
UserSchema.pre('save', async function (next) {
  const user = this as any; // 'this' refers to the user document

  if (!user.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Represents the User entity.
 */
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: number;
  phoneNumber: string;
  imageUrl: string;
  imageId: string;
  companyId?: string;
}
