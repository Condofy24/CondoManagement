import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestEntity } from './entities/request.entity';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel('Request') private readonly requestModel: Model<RequestEntity>,
  ) {}

  /**
   * Creates a new request.
   *
   * @param ownerId - The ID of the owner submitting the request.
   * @param createRequestDto - The data transfer object for request creation.
   * @returns A promise resolved with the created request entity.
   */
  async create(
    ownerId: string,
    createRequestDto: CreateRequestDto,
  ): Promise<RequestEntity> {
    const createdRequest = new this.requestModel({
      ...createRequestDto,
      owner: ownerId,
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
   * Finds a single request by its ID and owner ID.
   *
   * @param ownerId - The ID of the owner.
   * @param id - The ID of the request to find.
   * @returns A promise resolved with the found request entity.
   */
  async findOne(ownerId: string, id: string): Promise<RequestEntity> {
    const request = await this.requestModel
      .findOne({ _id: id, owner: ownerId })
      .exec();
    if (!request) {
      throw new NotFoundException(`Request with ID "${id}" not found.`);
    }
    return request;
  }
}
