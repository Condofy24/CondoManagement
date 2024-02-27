import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PrivilegeGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';
import { VerfService } from './verf.service';

@Controller('verfKey')
export class VerfController {
  constructor(private readonly verfService: VerfService) {}

  @Get(':unitId')
  @UseGuards(PrivilegeGuard)
  @Roles(0)
  findKeysByUnit(@Param('unitId') unitId: string) {
    return this.verfService.findByUnitId(unitId);
  }
}
