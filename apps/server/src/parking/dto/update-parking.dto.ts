import { PartialType } from '@nestjs/swagger';
import { CreateParkingDto } from './create-parking.dto';

export class UpdateParkingDto extends PartialType(CreateParkingDto) {}
