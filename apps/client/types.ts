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
  status: boolean;
  fees: number;
};

export type ParkingInformation = {
  parkingNumber: number;
  fees: number;
};

export type StorageInformation = {
  storageNumber: number;
  fees: number;
};

export enum AssetType{
  unit = "Unit",
  parking = "Parking",
  storage = "Storage",
}