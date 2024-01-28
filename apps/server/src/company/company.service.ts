import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanySchema, Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { response } from 'express';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('CompanySchema')
    private readonly companyModel: Model<Company>,
  ) {}

  public async createCompany(createCompanyDto: CreateCompanyDto) {
    const { name, location } = createCompanyDto;

    // Create company
    const newCompany = new this.companyModel({ name, location });

    const result = await newCompany.save();
    if (result instanceof Error)
      return new HttpException(' ', HttpStatus.INTERNAL_SERVER_ERROR);

    return response.status(HttpStatus.CREATED);
  }

  public async updateCompany(updateCompanyDto: UpdateCompanyDto) {
    const { name, location } = updateCompanyDto;

    // Find company
    const company = new this.companyModel({ name, location });
    if (!company) {
      throw new HttpException(
        { error: 'User not found', status: HttpStatus.NOT_FOUND },
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
}
