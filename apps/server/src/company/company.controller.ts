import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.createCompany(createCompanyDto);
  }

  @Patch(':id')
  updateCompany(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.updateCompany(id, updateCompanyDto);
  }

  @Get()
  getAllComapnies() {
    return this.companyService.findAll();
  }

  @Get(':id')
  getCompany(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Get('companyId/:id')
  getByCompanyId(@Param('id') id: string) {
    return this.companyService.findByCompanyId(id);
  }

  @Get('companyName/:name')
  getByCompanyName(@Param('name') name: string) {
    return this.companyService.findByCompanyName(name);
  }
}
