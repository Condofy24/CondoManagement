import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestEntity } from './entities/request.entity';
import { UnitService } from '../unit/unit.service';
import { UserService } from '../user/user.service';
import { UserRoles } from '../user/user.model';
import { BuildingService } from '../building/building.service';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel('Request') private readonly requestModel: Model<RequestEntity>,
    @Inject(forwardRef(() => UnitService))
    private readonly unitService: UnitService,
    private userService: UserService,
    private buildingService: BuildingService,
  ) { }

  /**
   * Creates a new request.
   *
   * @param ownerId - The ID of the owner submitting the request.
   * @param createRequestDto - The data transfer object for request creation.
   * @param unitId - The id of the unit this request is open for
   * @returns A promise resolved with the created request entity.
   */

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
        message: 'Must be an owner to submit a request for this unit',
      });

    const building = await this.buildingService.findBuildingById(unit.buildingId.toString());
    if (!building)
      throw new NotFoundException({ message: 'Building does not exist' });
    const createdRequest = new this.requestModel({
      ...createRequestDto,
      unit: unitId,
      owner: ownerId,
      status: 'Submitted',
      companyId: building?.companyId,
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
   * Updates a request with the specified id using the provided updatedFields.
   * @param id - The ID of the request to be updated.
   * @param updatedFields - The fields to be updated in the request.
   * @returns A promise that resolves to the updated request.
   * @throws NotFoundException if the request with the specified id is not found.
   * @throws BadRequestException if there is an error updating the request.
   */
  public async update(
    id: string,
    updatedFields: Partial<RequestEntity>,
  ): Promise<RequestEntity> {
    try {
      const updatedRequest = await this.requestModel
        .findByIdAndUpdate({ _id: id }, { $set: updatedFields }, { new: true })
        .exec();

      if (!updatedRequest) {
        throw new NotFoundException({ message: 'Request not found' });
      }

      return updatedRequest;
    } catch (error) {
      let errorDescription = 'Request could not be updated';

      if (
        error instanceof mongoose.Error.VersionError ||
        error.code === 11000
      ) {
        errorDescription =
          'A request with the same identifier already exists for this unit.';
      }

      throw new BadRequestException({
        error: error?.message,
        message: errorDescription,
      });
    }
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

  public async findAllRequestsForUser(userId: string): Promise<RequestEntity[]> {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new Error('User not found');

    const role = user.role;
    const userCompanyId = user.companyId;
    let requests = [];

    // Initial fetch based on role
    if (role === UserRoles.MANAGER) {
      requests = await this.requestModel.find({ companyId: userCompanyId }).exec();
    } else if (role === UserRoles.ACCOUNTANT) {
      requests = await this.requestModel.find({ type: RequestType.FINANCIAL, companyId: userCompanyId }).exec();
    } else if (role === UserRoles.STAFF) {
      requests = await this.requestModel.find({ type: RequestType.STAFF, companyId: userCompanyId }).exec();
    } else {
      throw new Error('Unauthorized access or invalid role');
    }

    return requests;
  }

}
