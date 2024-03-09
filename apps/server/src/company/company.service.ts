import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CompanyEntity,
  CompanyUniqueLocationIndex,
  CompanyUniqueNameIndex,
} from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { MongoServerError } from 'mongodb';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel('Company')
    private readonly companyModel: Model<CompanyEntity>,
  ) {}

  public async createCompany(
    createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyEntity> {
    const { companyName, companyLocation } = createCompanyDto;

    const company = new this.companyModel({
      name: companyName,
      location: companyLocation,
    });

    try {
      return await company.save();
    } catch (error) {
      let errorDescription = 'Company couldnt be created';

      if (error instanceof MongoServerError && error.code === 11000) {
        if (error?.message.includes(CompanyUniqueNameIndex))
          errorDescription = 'A company with the same name already exists';

        if (error?.message.includes(CompanyUniqueLocationIndex))
          errorDescription = 'A company with the same location already exists';
      }

      throw new BadRequestException(error?.message, errorDescription);
    }
  }

  public async findCompanyById(id: string): Promise<CompanyEntity | null> {
    return this.companyModel.findById(id).exec();
  }

  public async findCompanyByName(name: string): Promise<CompanyEntity | null> {
    return this.companyModel.findOne({ name }).exec();
  }
}
