export interface User {
  email: string;
  id: string;
  name: string;
  role: UserRoles;
  phoneNumber: string;
  imageUrl: string;
  imageId: string;
  companyId?: string;
}

export enum UserRoles {
  MANAGER = 0,
  STAFF = 1,
  ACCOUNTANT = 2,
  OWNER = 3,
  RENTER = 4,
}

export type Property = {
  id: string;
  name: string;
  companyId: string;
  address: string;
  unitCount: number;
  parkingCount: number;
  storageCount: number;
  fileUrl: string;
  filePublicId: string;
  fileAssetId: string;
};

export type FetchedEmployee = {
  name: string;
  email: string;
  phoneNumber: string;
  role: number;
  id: string;
};

export type Employee = Omit<FetchedEmployee, "role"> & { role: string };

export type RegistrationKey = {
  key: string;
  type: string;
  isClaimed: boolean;
};

export type Unit = {
  id: string;
  buildingId: string;
  ownerId?: string;
  renterId?: string;
  unitNumber: number;
  size: number;
  isOccupiedByRenter: boolean;
  fees: number;
  ownerKey?: RegistrationKey;
  renterKey?: RegistrationKey;
  lateFeesInterestRate?: number;
  overdueFees?: number;
  monthlyFeesBalance?: number;
};

export type IFinancialStatus = "Paid" | "Monthly Fees Due" | "Overdue Fees";

export interface UnitCol extends Unit {
  financialStatus?: IFinancialStatus;
}

export type Parking = {
  id: string;
  buildingId: string;
  unitId?: string;
  parkingNumber: number;
  isOccupiedByRenter: boolean;
  fees: number;
};

export type Storage = {
  id: string;
  buildingId: string;
  unitId?: string;
  storageNumber: number;
  isOccupiedByRenter: boolean;
  fees: number;
};

export type BuildingAsset = Unit | Asset;

export type Asset = Parking | Storage;

export enum BuildingAssetType {
  unit = "Unit",
  parking = "Parking",
  storage = "Storage",
}
