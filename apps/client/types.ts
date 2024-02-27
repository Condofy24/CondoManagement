export interface User {
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

export type Property = {
  name: string;
  address: string;
  units: number;
  parking: number;
  storage: number;
};

export type Unit = {
  unitNumber: number;
  size: number;
  status: boolean;
  fees: number;
};

export type Parking = {
  parkingNumber: number;
  fees: number;
};

export type Storage = {
  storageNumber: number;
  fees: number;
};

export type BuildingAsset = Unit | Asset;

export type Asset = Parking | Storage;

export enum BuildingAssetType {
  unit = "Unit",
  parking = "Parking",
  storage = "Storage",
}
