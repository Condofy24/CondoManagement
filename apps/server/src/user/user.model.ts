/**
 * Enum representing the roles of a user.
 */
export enum UserRoles {
  MANAGER = 0,
  STAFF = 1,
  ACCOUNTANT = 2,
  OWNER = 3,
  RENTER = 4,
}

/**
 * Token type representing the structure of a token.
 */
export type Token = { sub: string; iat: number; exp: number };

/**
 * Interface representing the profile of a user.
 */
export interface UserProfile {
  id: string;
  email: string;
  password: string;
  name: string;
  role: number;
  phoneNumber: string;
  imageUrl: string;
  imageId: string;
}
