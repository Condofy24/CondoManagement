import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { VerificationKey } from './entities/verf.entity';

@Injectable()
export class VerfService {
  constructor(
    @InjectModel('VerificationKey')
    private readonly verfModel: Model<VerificationKey>,
  ) {}
  public async createVerfKey(unitId: string, type: string, claimedBy: string) {
    const key = uuidv4();
    console.log('this is key', key);
    const newKey = new this.verfModel({
      unitId,
      key,
      type,
      claimedBy,
    });
    console.log('this is the whole key', newKey);
    const result = await newKey.save();
    return result;
  }
}
