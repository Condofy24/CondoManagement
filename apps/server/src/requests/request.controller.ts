import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestModel } from './models/request.model';
import { Roles } from '../auth/decorators/roles.decorator';
import { PrivilegeGuard } from '../auth/auth.guard';

@ApiTags('Request')
@ApiBearerAuth()
@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post(':ownerId')
  @ApiCreatedResponse({ description: 'Request created', type: RequestModel })
  async create(
    @Param('ownerId') ownerId: string,
    @Param('unitId') unitId: string,
    @Body() createRequestDto: CreateRequestDto,
  ) {
    return new RequestModel(
      await this.requestService.create(ownerId, unitId, createRequestDto),
    );
  }

  @Get(':ownerId')
  @ApiOkResponse({ description: 'Requests retrieved', type: [RequestModel] })
  async findAllForOwner(@Param('ownerId') ownerId: string) {
    return (await this.requestService.findAllForOwner(ownerId)).map(
      (request) => new RequestModel(request),
    );
  }

  @Patch(':id')
  @UseGuards(PrivilegeGuard)
  @Roles(1)
  @Roles(2)
  @ApiOkResponse({ description: 'Request updated', type: RequestModel })
  async update(
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
  ) {
    return new RequestModel(
      await this.requestService.update(id, updateRequestDto),
    );
  }

  @Delete(':ownerId/:id')
  @ApiOkResponse({ description: 'Request removed' })
  @ApiNotFoundResponse({ description: 'Request not found' })
  async remove(@Param('ownerId') ownerId: string, @Param('id') id: string) {
    await this.requestService.remove(ownerId, id);
    return { statusCode: 200, message: 'Request removed successfully.' };
  }
}
