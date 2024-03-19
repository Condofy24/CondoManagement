import { ApiProperty } from '@nestjs/swagger';
import { UnitEntity } from '../entities/unit.entity';
import { BuildingEntity } from '../../building/entities/building.entity';
import { RegistrationKeyModel } from './registration-key.model';
import { RegistrationKeyEntity } from '../entities/registration-key.entity';
import { ParkingModel } from 'src/parking/models/parking.model';
import { StorageModel } from 'src/storage/models/storage.model';

type UnitModelConstructorArgs = {
  entity: UnitEntity;
  parkings: ParkingModel[];
  storages: StorageModel[];
  building?: BuildingEntity;
  ownerKey?: RegistrationKeyEntity;
  renterKey?: RegistrationKeyEntity;
};

export class UnitModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  buildingId: string;

  @ApiProperty()
  buildingName?: string;

  @ApiProperty()
  buildingAddress?: string;

  @ApiProperty()
  ownerId?: string;

  @ApiProperty()
  renterId?: string;

  @ApiProperty()
  unitNumber: number;

  @ApiProperty()
  size: number;

  @ApiProperty()
  isOccupiedByRenter: boolean;

  @ApiProperty()
  fees: number;

  @ApiProperty()
  ownerKey?: RegistrationKeyModel;

  @ApiProperty()
  renterKey?: RegistrationKeyModel;

  @ApiProperty()
  lateFeesInterestRate?: number;

  @ApiProperty()
  overdueFees?: number;

  @ApiProperty()
  remainingMonthlyBalance?: number;

  @ApiProperty()
  totalMonthlyFees?: number;

  @ApiProperty()
  parkings: ParkingModel[];

  @ApiProperty()
  storages: StorageModel[];

  constructor({
    entity,
    building,
    ownerKey,
    renterKey,
    parkings = [],
    storages = [],
  }: UnitModelConstructorArgs) {
    this.id = entity._id.toString();
    this.buildingId = entity.buildingId.toString();
    this.ownerId = entity.ownerId?.toString();
    this.renterId = entity.renterId?.toString();
    this.unitNumber = entity.unitNumber;
    this.size = entity.size;
    this.isOccupiedByRenter = entity.isOccupiedByRenter;
    this.lateFeesInterestRate = entity.lateFeesInterestRate;
    this.remainingMonthlyBalance = entity.monthlyFeesBalance;
    this.overdueFees = entity.overdueFees;
    this.fees = entity.fees;

    this.parkings = parkings;
    this.storages = storages;

    const totalParkingFees = parkings.reduce((acc, current) => {
      return (acc += current.fees);
    }, 0);
    const totalStorageFees = storages.reduce((acc, current) => {
      return (acc += current.fees);
    }, 0);

    this.totalMonthlyFees = totalParkingFees + totalStorageFees + entity.fees;

    if (building) {
      this.buildingName = building.name;
      this.buildingAddress = building.address;
    }

    if (ownerKey) this.ownerKey = new RegistrationKeyModel(ownerKey);
    if (renterKey) this.renterKey = new RegistrationKeyModel(renterKey);
  }
}
