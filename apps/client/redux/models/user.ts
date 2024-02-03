export interface UserInfo {
  email: string;
  id: string;
  name: string;
  role: UserRolesEnum;
  phoneNumber: string;
  imageUrl: string;
  imageId: string;
}

export enum UserRolesEnum {
  MANAGER = 0,
  STAFF = 1,
  ACCOUNTANT = 2,
  OWNER = 3,
  RENTER = 4,
}
