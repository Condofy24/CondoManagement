import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { Unit } from './entities/unit.entity';
import { Model } from 'mongoose';
import { CreateUnitDto } from './dto/create-unit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { VerfService } from '../verf/verf.service';
import { BuildingService } from '../building/building.service';
import { VerfRolesEnum } from '../verf/entities/verf.entity';
import { response } from 'express';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { LinkUnitToBuidlingDto } from './dto/link-unit-to-building.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class UnitService {
  constructor(
    @InjectModel('Unit')
    private readonly unitModel: Model<Unit>,
    private readonly verfService: VerfService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => BuildingService))
    private readonly buildingService: BuildingService,
  ) {}

  public async createUnit(buildingId: string, createUnitDto: CreateUnitDto) {
    const { unitNumber, size, isOccupiedByRenter, fees } = createUnitDto;
    const buildingExists = await this.buildingService.findOne(buildingId);
    if (!buildingExists) {
      throw new HttpException(
        { error: "Building doesn't exists", status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
    const unit = await this.unitModel.findOne({
      unitNumber,
      buildingId: buildingExists.id,
    });
    if (unit) {
      if (unit.buildingId.equals(buildingExists.id)) {
        throw new HttpException(
          { error: 'Unit already exists', status: HttpStatus.BAD_REQUEST },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const newUnit = new this.unitModel({
      buildingId: buildingExists.id,
      unitNumber,
      size,
      isOccupiedByRenter,
      fees,
    });
    const result = await newUnit.save();
    const verfKeyOwner = this.verfService.createVerfKey(
      result.id,
      VerfRolesEnum.OWNER,
      '',
    );
    const verKeyRenter = this.verfService.createVerfKey(
      result.id,
      VerfRolesEnum.RENTER,
      '',
    );
    let unitCount = buildingExists.unitCount;
    unitCount++;
    this.buildingService.findByIdandUpdateUnitCount(buildingId, unitCount);
    return {result,verfKeyOwner,verKeyRenter};
  }
  public async updateUnit(unitId: string, updateUnitDto: UpdateUnitDto) {
    const { unitNumber, size, isOccupiedByRenter, fees } = updateUnitDto;
    const unit = await this.unitModel.findById(unitId);
    if (!unit) {
      throw new HttpException(
        { error: "Building doesn't exists", status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.unitModel.findByIdAndUpdate(unitId, {
      unitNumber: unitNumber,
      size: size,
      isOccupiedByRenter: isOccupiedByRenter,
      fees: fees,
    }); // To return the updated document)
    if (result instanceof Error)
      return new HttpException(' ', HttpStatus.INTERNAL_SERVER_ERROR);
    return {
      unitNumber,
      size,
      isOccupiedByRenter,
      fees,
    };
  }

  public async findAll(buildingId: string): Promise<Unit[]> {
    const units = await this.unitModel.find({ buildingId }).exec();
    return units.map(
      (unit: Unit) =>
        ({
          buildingId: unit.buildingId,
          ownerId: unit.ownerId,
          renterId: unit.renterId,
          unitNumber: unit.unitNumber,
          size: unit.size,
          isOccupiedByRenter: unit.isOccupiedByRenter,
          fees: unit.fees,
        }) as Unit,
    );
  }
  public async findOne(id: string) {
    const unit = await this.unitModel.findById({ _id: id }).exec();
    if (!unit) {
      throw new HttpException(
        { error: 'Unit not found', status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      id: unit._id,
      buildingId: unit.buildingId,
      ownerId: unit.ownerId,
      renterId: unit.renterId,
      unitNumber: unit.unitNumber,
      size: unit.size,
      isOccupiedByRenter: unit.isOccupiedByRenter,
      fees: unit.fees,
    };
  }
  public async remove(id: string): Promise<any> {
    const unit = await this.unitModel.findById(id).exec();
    if (!unit) {
      throw new HttpException('Unit not found', HttpStatus.BAD_REQUEST);
    }
    const buildingId = unit.buildingId.toString();
    const building = await this.buildingService.findOne(buildingId);
    if (!building) {
      throw new HttpException(
        {
          error: "Building doesn't exists",
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    let unitCount = building.unitCount;

    await this.unitModel.remove(unit);
    unitCount--;
    this.buildingService.findByIdandUpdateUnitCount(buildingId, unitCount);

    return response.status(HttpStatus.NO_CONTENT);
  }
  public async linkUnitToUser(
    buildingId: string,
    userId: string,
    linkUnitToBuildingDto: LinkUnitToBuidlingDto,
  ) {
    const { unitNumber } = linkUnitToBuildingDto;
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new HttpException(
        { error: 'User not found', status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    const unitExists = await this.unitModel.find({ unitNumber: unitNumber });
    let unit;
    for (let i = 0; i < unitExists.length; i++) {
      if (JSON.stringify(unitExists[i]).localeCompare(buildingId)) {
        unit = unitExists[i];
      }
    }
    if (!unit) {
      throw new HttpException(
        { error: 'Unit not found', status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    let result;
    if (user.role == 3) {
      result = await this.unitModel.findOneAndUpdate(
        { unitNumber, buildingId },
        {
          ownerId: userId,
        },
      );
    }
    if (user.role == 4) {
      result = await this.unitModel.findOneAndUpdate(
        { unitNumber, buildingId },
        {
          renterId: userId,
          isOccupiedByRenter: true,
        },
      );
    }
    return {
      id: unit._id,
      buildingId: unit.buildingId,
      ownerId: unit.ownerId,
      renterId: unit.renterId,
      unitNumber: unit.unitNumber,
      size: unit.size,
      isOccupiedByRenter: unit.isOccupiedByRenter,
      fees: unit.fees,
    };
  }
  public async findOwnerUnits(ownerId: string): Promise<Unit[]> {
    const user = await this.userService.findById(ownerId);
    if (!user) {
      throw new HttpException(
        { error: 'User not found', status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    if (user.role != 3) {
      throw new UnauthorizedException();
    }

    const units = await this.unitModel.find({ ownerId }).exec();
    return units.map(
      (unit: Unit) =>
        ({
          buildingId: unit.buildingId,
          ownerId: unit.ownerId,
          renterId: unit.renterId,
          unitNumber: unit.unitNumber,
          size: unit.size,
          isOccupiedByRenter: unit.isOccupiedByRenter,
          fees: unit.fees,
        }) as Unit,
    );
  }
  public async findRenterUnit(renterId: string) {
    const user = await this.userService.findById(renterId);
    if (!user) {
      throw new HttpException(
        { error: 'User not found', status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    if (user.role != 4) {
      throw new UnauthorizedException();
    }
    const unit = await this.unitModel.findOne({ renterId }).exec();
    if (!unit) {
      return null;
    }
    return {
      id: unit._id,
      buildingId: unit.buildingId,
      ownerId: unit.ownerId,
      renterId: unit.renterId,
      unitNumber: unit.unitNumber,
      size: unit.size,
      isOccupiedByRenter: unit.isOccupiedByRenter,
      fees: unit.fees,
    };
  }
}
