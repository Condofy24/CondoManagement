import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyService } from './company.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Company')
@ApiBearerAuth()
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
}
