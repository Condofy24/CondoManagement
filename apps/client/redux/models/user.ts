export interface UserInfo {
  email: string;
  name: string;
  role: UserRolesEnum;
}

export enum UserRolesEnum {
  MANAGER = 0,
  STAFF = 1,
  ACCOUNTANT = 2,
  OWNER = 3,
  RENTER = 4,
}