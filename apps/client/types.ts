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

export type Request = {
  title: string;
  type: RequestType;
  description: string;
  status: RequestStatus;
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
  buildingName?: string;
  buildingAddress?: string;
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
  remainingMonthlyBalance?: number;
  totalMonthlyFees: number;
  parkings: Parking[];
  storages: Storage[];
};

export type Payment = {
  date: Date;
  amount: number;
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

export type Facility = {
  id: string;
  buildingId: string;
  name: string;
  fees: number;
  duration: number;
  operationTimes: Array<{
    weekDay: WeekDay;
    openingTime: string;
    closingTime: string;
  }>;
};

export type FacilityAvailabilityStatus = "available" | "reserved";

export type FacilityAvailability = {
  id: string;
  facilityId: string;
  startDate: Date;
  endDate: Date;
  status: FacilityAvailabilityStatus;
};

// Reservation types
export enum ReservationStatus {
  CANCELED = "Canceled",
  ACTIVE = "Active",
  CANCELED_BY_COMPANY = "Canceled by company",
  COMPLETE = "Complete",
}

export type Reservation = {
  id: string;
  facilityId: string;
  availabilityId: string;
  userId: string;
  status: ReservationStatus;
  facilityName?: string;
  buildngName?: string;
  date?: Date[];
};

export type Asset = Unit | BuildingResource;

export type BuildingResource = Parking | Storage | Facility;

export enum BuildingAsset {
  unit = "Unit",
  parking = "Parking",
  storage = "Storage",
  facility = "Facility",
}

export enum WeekDay {
  Monday = 0,
  Tuesday = 1,
  Wednesday = 2,
  Thursday = 3,
  Friday = 4,
  Saturday = 5,
  Sunday = 6,
}

export type OwnerInformation = {
  name: string;
  email: string;
  phoneNumber: string;
};

export enum RequestStatus {
  SUBMITTED = "Submitted",
  IN_PROGRESS = "In Progress",
  RESOLVED = "Resolved",
}

export enum RequestType {
  FINANCIAL = "Financial issue",
  STAFF = "Staff (general)",
  ADMIN = "Admin",
}
