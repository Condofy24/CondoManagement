import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
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
import { AuthGuard } from '../auth/auth.guard';
import { RequestEntity } from './entities/request.entity';

@ApiTags('Request')
@ApiBearerAuth()
@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) { }

  @Post(':unitId')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ description: 'Request created', type: RequestModel })
  async create(
    @Request() req: any,
    @Param('unitId') unitId: string,
    @Body() createRequestDto: CreateRequestDto,
  ) {
    return new RequestModel(
      await this.requestService.create(unitId, createRequestDto, req.user.sub),
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
  @ApiOkResponse({ description: 'Request updated', type: RequestModel })
  async update(
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
  ) {
    return new RequestModel(
      await this.requestService.update(id, updateRequestDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Request removed' })
  @ApiNotFoundResponse({ description: 'Request not found' })
  async remove(@Param('id') id: string) {
    await this.requestService.remove(id);
    return { statusCode: 200, message: 'Request removed successfully.' };
  }

  @Get('user/:userId')
  async getAllRequestsForUser(
    @Param('userId') userId: string,
  ): Promise<RequestEntity[]> {
    return await this.requestService.findAllRequestsForUser(userId);

  }
}
