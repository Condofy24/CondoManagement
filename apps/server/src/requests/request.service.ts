import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestEntity } from './entities/request.entity';
import { UnitService } from '../unit/unit.service';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel('Request') private readonly requestModel: Model<RequestEntity>,
    @Inject(forwardRef(() => UnitService))
    private readonly unitService: UnitService,
  ) {}

  /**
   * Creates a new request.
   *
   * @param ownerId - The ID of the owner submitting the request.
   * @param createRequestDto - The data transfer object for request creation.
   * @param unitId - The id of the unit this request is open for
   * @returns A promise resolved with the created request entity.
   */

  //SET THE STATUS HERE
  async create(
    unitId: string,
    createRequestDto: CreateRequestDto,
    ownerId: string,
  ): Promise<RequestEntity> {
    const unit = await this.unitService.findUnitById(unitId);
    if (!unit)
      throw new NotFoundException({ message: 'Storage does not exist' });
    if (unit.ownerId.toString() !== ownerId)
      throw new BadRequestException({
        message: 'You are not the owner of this unit',
      });
    const createdRequest = new this.requestModel({
      ...createRequestDto,
      unit: unitId,
      status: 'Submitted',
    });

    return createdRequest.save();
  }

  /**
   * Finds all requests for a specific owner.
   *
   * @param ownerId - The ID of the owner whose requests to find.
   * @returns A promise resolved with an array of request entities.
   */
  async findAllForOwner(ownerId: string): Promise<RequestEntity[]> {
    return this.requestModel.find({ owner: ownerId }).exec();
  }

  /**
   * Updates a request by its ID and owner ID.
   *
   * @param ownerId - The ID of the owner.
   * @param id - The ID of the request to update.
   * @param updateRequestDto - The data transfer object for request updating.
   * @returns A promise resolved with the updated request entity.
   */
  async update(
    id: string,
    updateRequestDto: UpdateRequestDto,
  ): Promise<RequestEntity> {
    const updatedRequest = await this.requestModel
      .findOneAndUpdate({ _id: id }, updateRequestDto, {
        new: true,
      })
      .exec();
    if (!updatedRequest) {
      throw new NotFoundException(`Request with ID "${id}" not found.`);
    }
    return updatedRequest;
  }

  /**
   * Deletes a request by its ID and owner ID.
   *
   * @param ownerId - The ID of the owner.
   * @param id - The ID of the request to delete.
   * @returns A promise resolved with any result.
   */
  async remove(id: string): Promise<void> {
    const result = await this.requestModel.findOneAndDelete({ _id: id }).exec();
    if (!result) {
      throw new NotFoundException(`Request with ID "${id}" not found.`);
    }
  }
}