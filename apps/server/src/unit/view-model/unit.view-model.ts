export interface Unit {
  buildingId: string;
  ownerId?: string;
  renterId?: string;
  unitNumber: number;
  size: number;
  isOccupiedByRenter: boolean;
  fees: number;
}
