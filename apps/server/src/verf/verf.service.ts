import { Injectable } from '@nestjs/common';
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
    return result;
  }
}
