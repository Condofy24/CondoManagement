import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { response } from 'express';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel('Company')
    private readonly companyModel: Model<Company>,
  ) {}

  public async createCompany(createCompanyDto: CreateCompanyDto) {
    const { name, location } = createCompanyDto;

    const company = await this.companyModel.findOne({ name });
    if (company) {
      throw new HttpException(
        { error: 'Company already exists', status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create company
    const newCompany = new this.companyModel({ name, location });

    const result = await newCompany.save();
    if (result instanceof Error)
      return new HttpException(' ', HttpStatus.INTERNAL_SERVER_ERROR);

    return { id: result._id, name, location };
  }

  public async updateCompany(id: string, updateCompanyDto: UpdateCompanyDto) {
    const { name, location } = updateCompanyDto;

    // Find company
    const company = await this.companyModel.findById(id);
    if (!company) {
      throw new HttpException(
        { error: 'Company not found', status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    company.name = name;
    company.location = location;
    await company.save();

    return {
      id: company.id,
      name: company.name,
      location: company.location,
    };
  }

  public async findOne(id: string) {
    const company = await this.companyModel.findById(id);
    if (!company) {
      throw new HttpException(
        { error: 'Company not found', status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      id: company._id,
      name: company.name,
      location: company.location,
    };
  }
}
