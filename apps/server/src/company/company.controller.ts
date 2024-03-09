import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.createCompany(createCompanyDto);
  }

  @Get(':id')
  getCompany(@Param('id') id: string) {
    return this.companyService.findCompanyById(id);
  }

  @Get('companyName/:name')
  getByCompanyName(@Param('name') name: string) {
    return this.companyService.findCompanyByName(name);
  }
}
