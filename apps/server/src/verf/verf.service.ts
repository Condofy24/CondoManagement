import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { VerfRolesEnum, VerificationKey } from './entities/verf.entity';

@Injectable()
export class VerfService {
  constructor(
    @InjectModel('VerificationKey')
    private readonly verfModel: Model<VerificationKey>,
  ) {}
  public async createVerfKey(
    unitId: string,
    type: VerfRolesEnum,
    claimedBy: string,
  ) {
    const key = uuidv4();
    const newKey = new this.verfModel({
      unitId,
      key,
      type,
      claimedBy,
    });
    const result = await newKey.save();
    return {
      id: result._id,
      unitId: result.unitId,
      key: result.key,
      type: result.type,
      claimedBy: result.claimedBy,
    };
  }

  public async findByVerfKey(key: string) {
    const verf = await this.verfModel.findOne({ key });
    if (!verf) {
      return false;
    }
    return {
      id: verf._id,
      unitId: verf.unitId,
      key: verf.key,
      type: verf.type,
      claimedBy: verf.claimedBy,
    };
  }

  public async findByUnitId(unitId: string) {
    const verfKeys = await this.verfModel.find({ unitId });
    if (!verfKeys) {
      throw new HttpException('Unit does not exist', HttpStatus.NOT_FOUND);
    }
    return verfKeys.map((key) => ({
      id: key._id,
      unitId: key.unitId,
      key: key.key,
      type: key.type,
      claimedBy: key.claimedBy,
    }));
  }
}
