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

export type PropertyInformation = {
  name: string;
  address: string;
  units: number;
  parking: number;
  storage: number;
};

export type UnitInformation = {
  unitNumber: number;
  size: number;
  isOccupied: boolean;
  fees: number;
};