import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
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

@ApiTags('Request')
@ApiBearerAuth()
@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post(':ownerId')
  @ApiCreatedResponse({ description: 'Request created', type: RequestModel })
  async create(
    @Param('ownerId') ownerId: string,
    @Body() createRequestDto: CreateRequestDto,
  ) {
    return new RequestModel(
      await this.requestService.create(ownerId, createRequestDto),
    );
  }

  @Get(':ownerId')
  @ApiOkResponse({ description: 'Requests retrieved', type: [RequestModel] })
  async findAllForOwner(@Param('ownerId') ownerId: string) {
    return (await this.requestService.findAllForOwner(ownerId)).map(
      (request) => new RequestModel(request),
    );
  }

  @Get(':ownerId/:id')
  @ApiOkResponse({ description: 'Request retrieved', type: RequestModel })
  @ApiNotFoundResponse({ description: 'Request not found' })
  async findOne(@Param('ownerId') ownerId: string, @Param('id') id: string) {
    return new RequestModel(await this.requestService.findOne(ownerId, id));
  }

  @Patch(':ownerId/:id')
  @ApiOkResponse({ description: 'Request updated', type: RequestModel })
  async update(
    @Param('ownerId') ownerId: string,
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
  ) {
    return new RequestModel(
      await this.requestService.update(ownerId, id, updateRequestDto),
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
