import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserEntity,
  UserUniqueEmailIndex,
  UserUniquePhoneNumberIndex,
} from './entities/user.entity';
import { response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateManagerDto } from './dto/create-manager.dto';
import { CompanyService } from '../company/company.service';
import { UnitService } from '../unit/unit.service';
import { MongoServerError } from 'mongodb';

@Injectable()
/**
 * Service responsible for managing user-related operations.
 * @remarks
 * This service handles user creation, retrieval, update, and deletion.
 */
export class UserService {
  /**
   * Constructs a new instance of the UserService class.
   * @param userModel The User model.
   * @param cloudinary The Cloudinary service.
   * @param companyService The Company service.
   */
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserEntity>,
    private cloudinary: CloudinaryService,
    private companyService: CompanyService,
    @Inject(forwardRef(() => UnitService))
    private unitService: UnitService,
  ) {}

  /**
   * Creates a new manager.
   * @param createManagerDto The DTO containing the manager details.
   * @param image The optional image file for the manager.
   * @returns The created manager.
   * @throws HttpException if there is an error creating the manager.
   */
  public async createManager(
    createManagerDto: CreateManagerDto,
    image?: Express.Multer.File,
  ): Promise<UserEntity> {
    const { email, password, name, phoneNumber, companyLocation, companyName } =
      createManagerDto;

    const company = await this.companyService.createCompany({
      companyName,
      companyLocation,
    });

    const { imageUrl, imageId } = await this.uploadProfileImage(image);

    // Create user
    const newUser = new this.userModel({
      email,
      password,
      name,
      companyId: company._id,
      role: 0,
      phoneNumber,
      imageUrl,
      imageId,
    });

    try {
      return await newUser.save();
    } catch (error) {
      await this.companyService.deleteCompany(company._id.toString());
      throw new BadRequestException(
        error?.message,
        this.getUserCreateErrorDescription(error),
      );
    }
  }

  /**
   * Creates a new employee.
   * @param createEmployeeDto The DTO containing the employee details.
   * @returns The created employee.
   * @throws HttpException if there is an error creating the employee.
   */
  public async createEmployee(createEmployeeDto: CreateEmployeeDto) {
    const { email, name, role, companyId, phoneNumber } = createEmployeeDto;

    // Check company exists
    const company = await this.companyService.findCompanyById(companyId);

    if (!company) throw new BadRequestException('Invalid company Id');

    const { imageUrl, imageId } = await this.uploadProfileImage(undefined);

    // Create user
    const newUser = new this.userModel({
      email,
      password: `${name}_${phoneNumber}`, // Default password
      name,
      role,
      phoneNumber,
      imageUrl,
      companyId,
      imageId,
    });

    try {
      return await newUser.save();
    } catch (error) {
      throw new BadRequestException(
        error?.message,
        this.getUserCreateErrorDescription(error),
      );
    }
  }

  /**
   * Creates a new user.
   * @param createUserDto The DTO containing the user details.
   * @param image The optional image file for the user.
   * @returns The created user.
   * @throws HttpException if there is an error creating the user.
   */
  public async createUser(
    createUserDto: CreateUserDto,
    image?: Express.Multer.File,
  ) {
    const { email, password, name, phoneNumber, verfKey } = createUserDto;

    // check if Key exists
    const registrationKey =
      await this.unitService.findUnitRegistrationKey(verfKey);

    if (!registrationKey)
      throw new BadRequestException('Registration Key is invalid');

    const { imageUrl, imageId } = await this.uploadProfileImage(image);

    // Create user
    const newUser = new this.userModel({
      email,
      password,
      name,
      role: registrationKey.type == 'owner' ? 3 : 4,
      phoneNumber,
      imageUrl,
      imageId,
    });

    const session = await this.userModel.db.startSession();
    session.startTransaction();

    try {
      const createdUser = await newUser.save({ session });

      await this.unitService.linkUnitToUser(
        createdUser._id.toString(),
        registrationKey,
        session,
      );

      await session.commitTransaction();

      return createdUser;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      )
        throw error;
      throw new BadRequestException(
        error?.message,
        this.getUserCreateErrorDescription(error),
      );
    } finally {
      session.endSession();
    }
  }

  /**
   * Finds a user by email.
   * @param email The email of the user to find.
   * @returns The found user, or undefined if not found.
   */
  public async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Finds a user by ID.
   * @param id The ID of the user to find.
   * @returns The found user, or undefined if not found.
   */
  public async findUserById(id: string): Promise<UserEntity | null> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  /**
   * Removes a user by ID.
   * @param id The ID of the user to remove.
   * @returns The response status.
   * @throws HttpException if the user is not found.
   */
  public async remove(id: string): Promise<any> {
    try {
      await this.userModel.findOneAndRemove({ _id: id }).exec();
    } catch {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return response.status(HttpStatus.NO_CONTENT);
  }

  /**
   * Retrieves the privilege level of a user.
   * @param id The ID of the user.
   * @returns The privilege level of the user.
   */
  public async getPrivilege(id: string): Promise<number | undefined> {
    const user = await this.userModel.findOne({ _id: id });
    return user?.role;
  }

  /**
   * Updates a user's information.
   * @param id The ID of the user to update.
   * @param updateUserDto The DTO containing the updated user details.
   * @param image The optional image file for the user.
   * @returns The updated user.
   * @throws HttpException if there is an error updating the user.
   */
  public async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    image?: Express.Multer.File,
  ): Promise<UserEntity> {
    const { name, email, newPassword, phoneNumber } = updateUserDto;

    // Find the user by id
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException('User not found');

    if (user.email != email) {
      const isUserAlreadyExist = await this.userModel.exists({ email: email });
      if (!!isUserAlreadyExist)
        throw new BadRequestException('Email in use by another user.');
    }

    if (user.phoneNumber != phoneNumber) {
      const isUserAlreadyExist = await this.userModel.exists({
        phoneNumber: phoneNumber,
      });
      if (!!isUserAlreadyExist)
        throw new BadRequestException('Phone number in use by another user.');
    }

    if (newPassword) {
      user.password = newPassword;
    }

    let imageUrl = '';
    let imageId = '';
    if (image) {
      let { imageUrl: newUrl, imageId: newId } =
        await this.uploadProfileImage(image);
      imageUrl = newUrl;
      imageId = newId;
    } else {
      imageUrl = user.imageUrl;
      imageId = user.imageId;
    }

    try {
      return await user.save();
    } catch (error) {
      throw new BadRequestException(
        error?.message,
        this.getUserCreateErrorDescription(error),
      );
    }
  }

  /**
   * Retrieves all user profiles.
   * @returns An array of user profiles.
   */
  public async findAll(attribute?: Record<string, string>) {
    const users = attribute
      ? await this.userModel.find(attribute).exec()
      : await this.userModel.find().exec();
    return users;
  }

  private getUserCreateErrorDescription(error: any): string {
    let errorDescription = 'Manager couldnt be created';

    if (error instanceof MongoServerError && error.code === 11000) {
      if (error?.message.includes(UserUniqueEmailIndex))
        errorDescription = 'A user with the same email exists';

      if (error?.message.includes(UserUniquePhoneNumberIndex))
        errorDescription = 'A user with the same phone number already exists';
    }

    return errorDescription;
  }

  private async uploadProfileImage(image: Express.Multer.File | undefined) {
    if (!image) {
      return {
        imageUrl:
          'https://res.cloudinary.com/dzu5t20lr/image/upload/v1706910325/m9ijj0xc1d2yzclssyzc.png',
        imageId: 'default_user',
      };
    }
    const { secure_url: imageUrl, public_id: imageId } =
      await this.cloudinary.uploadFile(image);

    return { imageUrl, imageId };
  }
}
