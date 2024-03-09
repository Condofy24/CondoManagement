import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { isEmail } from 'class-validator';

export interface UserEntity extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: number;
  phoneNumber: string;
  imageUrl: string;
  imageId: string;
  companyId?: string;
}

interface UserModel extends mongoose.Model<UserEntity> {}

/**
 * Defines the schema for the User entity.
 */
export const UserSchema = new mongoose.Schema<UserEntity, UserModel>(
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
 * Middleware function that automatically hashes the password before saving it to the database.
 */
UserSchema.pre('save', async function (next) {
  const user: any = this; // 'this' refers to the user document

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
 * Indices for uniqeness
 */

export const UserUniqueEmailIndex = 'user-unique-email-index';
UserSchema.index({ email: 1 }, { unique: true, name: UserUniqueEmailIndex });

export const UserUniquePhoneNumberIndex = 'user-unique-phonenumber-index';
UserSchema.index(
  { phoneNumber: 1 },
  { unique: true, name: UserUniquePhoneNumberIndex },
);

export default mongoose.model('User', new mongoose.Schema(UserSchema));
