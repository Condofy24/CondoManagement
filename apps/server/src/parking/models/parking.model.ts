import { ApiProperty } from '@nestjs/swagger';
import { ParkingEntity } from '../entities/parking.entity';

export class ParkingModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  buildingId: string;

  @ApiProperty()
  unitId?: string;

  @ApiProperty()
  parkingNumber: number;

  @ApiProperty()
  isOccupiedByRenter: boolean;

  @ApiProperty()
  fees: number;

  constructor(entity: ParkingEntity) {
    this.id = entity._id.toString();
    this.buildingId = entity.buildingId.toString();
    this.unitId = entity.unitId?.toString();
    this.parkingNumber = entity.parkingNumber;
    this.isOccupiedByRenter = entity.isOccupiedByRenter;
    this.fees = entity.fees;
  }
}
