/**
 * Enum representing the roles of a user.
 */
export enum UserRoles {
  MANAGER = 0, // gets all requests Admin get all requests by building ID
  STAFF = 1, // general
  ACCOUNTANT = 2,//only finanicial
  OWNER = 3, // done
  RENTER = 4, // done
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
