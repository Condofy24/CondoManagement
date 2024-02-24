import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { response } from 'express';
import { Token, UserProfile, UserRolesEnum } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateManagerDto } from './dto/create-manager.dto';
import { CompanyService } from '../company/company.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private cloudinary: CloudinaryService,
    private companyService: CompanyService,
  ) {}

  async uploadImageToCloudinary(file: Express.Multer.File) {
    try {
      const imageResponse = await this.cloudinary.uploadFile(file);
      return imageResponse;
    } catch (error) {
      throw new BadRequestException('Failed to upload image to Cloudinary.');
    }
  }

  public async createManager(
    createManagerDto: CreateManagerDto,
    image?: Express.Multer.File,
  ) {
    const { email, password, name, phoneNumber, companyLocation, companyName } =
      createManagerDto;

    // Check user doesn't already exist
    const emailInUse = await this.userModel.exists({ email: email });
    const phoneNumberInUse = await this.userModel.exists({
      phoneNumber: phoneNumber,
    });
    if (emailInUse?._id || phoneNumberInUse?._id) {
      const errorMessage =
        emailInUse && phoneNumberInUse
          ? 'Email and phone number exist'
          : emailInUse
            ? 'Email already exists'
            : phoneNumberInUse
              ? 'Phone number exists'
              : '';
      throw new HttpException(
        { error: errorMessage, status: HttpStatus.CONFLICT },
        HttpStatus.CONFLICT,
      );
    }

    // Check company exists
    const companyExists =
      await this.companyService.findByCompanyName(companyName);
    if (companyExists) {
      throw new HttpException(
        { error: 'Company exists already', status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
    const companyRes = await this.companyService.createCompany({
      companyName,
      companyLocation,
    });

    let companyId;

    if (!('companyId' in companyRes)) {
      throw new HttpException(
        {
          error: "Couldn't create company",
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    companyId = companyRes.companyId;

    let imageUrl =
      'https://res.cloudinary.com/dzu5t20lr/image/upload/v1706910325/m9ijj0xc1d2yzclssyzc.png';
    let imageId = 'default_user';
    if (image) {
      const imageResponse = await this.uploadImageToCloudinary(image);
      imageUrl = imageResponse.secure_url;
      imageId = imageResponse.public_id;
    }

    // Create user
    const newUser = new this.userModel({
      email,
      password,
      name,
      companyId,
      role: 0,
      phoneNumber,
      imageUrl,
      imageId,
    });
    try {
      await newUser.save();
    } catch (e) {
      throw new HttpException(e?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response.status(HttpStatus.CREATED);
  }

  public async createEmployee(createEmployeeDto: CreateEmployeeDto) {
    const { email, name, role, companyId, phoneNumber } = createEmployeeDto;

    // Check user doesn't already exist
    const emailInUse = await this.userModel.exists({ email: email });
    const phoneNumberInUse = await this.userModel.exists({
      phoneNumber: phoneNumber,
    });
    if (emailInUse?._id || phoneNumberInUse?._id) {
      const errorMessage =
        emailInUse && phoneNumberInUse
          ? 'Email and phone number exist'
          : emailInUse
            ? 'Email already exists'
            : phoneNumberInUse
              ? 'Phone number exists'
              : '';
      throw new HttpException(
        { error: errorMessage, status: HttpStatus.CONFLICT },
        HttpStatus.CONFLICT,
      );
    }

    // Check company exists
    const companyExists = await this.companyService.findByCompanyId(companyId);
    if (!companyExists) {
      throw new HttpException(
        { error: "Company doesn't exists", status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }

    let imageUrl =
      'https://res.cloudinary.com/dzu5t20lr/image/upload/v1706910325/m9ijj0xc1d2yzclssyzc.png';
    let imageId = 'default_user';
    // Create user
    const newUser = new this.userModel({
      email,
      password: `${name}_${phoneNumber}`, // Default password
      name,
      role: UserRolesEnum[role as keyof typeof UserRolesEnum],
      phoneNumber,
      imageUrl,
      companyId,
      imageId,
    });

    try {
      await newUser.save();
    } catch (e) {
      throw new HttpException(e?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return response.status(HttpStatus.CREATED);
  }

  public async createUser(
    createUserDto: CreateUserDto,
    image?: Express.Multer.File,
  ) {
    const { email, password, name, role, phoneNumber } = createUserDto;

    // Check user doesn't already exist
    const emailInUse = await this.userModel.exists({ email: email });
    const phoneNumberInUse = await this.userModel.exists({
      phoneNumber: phoneNumber,
    });
    if (emailInUse?._id || phoneNumberInUse?._id) {
      const errorMessage =
        emailInUse && phoneNumberInUse
          ? 'Email and phone number exist'
          : emailInUse
            ? 'Email already exists'
            : phoneNumberInUse
              ? 'Phone number exists'
              : '';
      throw new HttpException(
        { error: errorMessage, status: HttpStatus.CONFLICT },
        HttpStatus.CONFLICT,
      );
    }
    let imageUrl =
      'https://res.cloudinary.com/dzu5t20lr/image/upload/v1706910325/m9ijj0xc1d2yzclssyzc.png';
    let imageId = 'default_user';
    if (image) {
      const imageResponse = await this.uploadImageToCloudinary(image);
      imageUrl = imageResponse.secure_url;
      imageId = imageResponse.public_id;
    }

    // Create user
    const newUser = new this.userModel({
      email,
      password,
      name,
      role: UserRolesEnum[role as keyof typeof UserRolesEnum],
      phoneNumber,
      imageUrl,
      imageId,
    });
    const result = await newUser.save();
    if (result instanceof Error)
      return new HttpException(' ', HttpStatus.INTERNAL_SERVER_ERROR);

    return response.status(HttpStatus.CREATED);
  }

  public async findOne(userEmail: string): Promise<User | undefined | null> {
    return this.userModel.findOne({ email: userEmail }).exec();
  }
  public async findById(id: string): Promise<User | undefined | null> {
    return this.userModel.findById(id).exec();
  }

  public async getProfile(token: Token): Promise<UserProfile> {
    const user = await this.userModel.findById(token.sub);
    if (!user) {
      throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return {
      email: user.email,
      name: user.name,
      role: user.role,
      phoneNumber: user.phoneNumber,
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    } as UserProfile;
  }

  public async findAll(): Promise<UserProfile[]> {
    const users = await this.userModel.find().exec();
    return users.map(
      (user: User) =>
        ({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phoneNumber: user.phoneNumber,
          imageUrl: user.imageUrl,
          imageId: user.imageId,
        }) as UserProfile,
    );
  }

  public async remove(id: string): Promise<any> {
    try {
      await this.userModel.findOneAndRemove({ _id: id }).exec();
    } catch {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return response.status(HttpStatus.NO_CONTENT);
  }

  public async getPrivilege(id: string): Promise<number | undefined> {
    const user = await this.userModel.findOne({ _id: id });
    return user?.role;
  }
  public async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    image?: Express.Multer.File,
  ): Promise<UserDto> {
    const { name, email, newPassword, phoneNumber } = updateUserDto;

    // Find the user by id
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException(
        { error: 'User not found', status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    if (user.email != email) {
      const isUserAlreadyExist = await this.userModel.exists({ email: email });
      if (!!isUserAlreadyExist) {
        throw new HttpException(
          { error: 'User already exists', status: HttpStatus.CONFLICT },
          HttpStatus.CONFLICT,
        );
      }
    }
    // Check phone number doesn't already exist
    const userWithPhoneNumber = await this.userModel.exists({
      phoneNumber: phoneNumber,
    });
    if (userWithPhoneNumber && userWithPhoneNumber._id.toString() !== id) {
      throw new HttpException(
        {
          error: 'Phone number already linked to another user',
          status: HttpStatus.CONFLICT,
        },
        HttpStatus.CONFLICT,
      );
    }
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }
    let imageUrl = '';
    let imageId = '';
    if (image) {
      const imageResponse = await this.uploadImageToCloudinary(image);
      imageUrl = imageResponse.secure_url;
      imageId = imageResponse.public_id;
    } else {
      imageUrl = user.imageUrl;
      imageId = user.imageId;
    }

    user.email = email;
    user.name = name;
    user.phoneNumber = phoneNumber;
    user.imageUrl = imageUrl;
    user.imageId = imageId;
    await user.save();

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phoneNumber: user.phoneNumber,
      imageUrl: imageUrl,
      imageId: imageId,
    };
  }

  // TODO: Manager should be able to modify his employees
  // public async updateUserByManager(
  //   id: string,
  //   updateUserDto: UpdateUserDtoByManager,
  // ): Promise<UserDto> {
  //   const { name, email, role, team } = updateUserDto;

  //   const user = await this.userModel.findById(id);

  //   if (!user) {
  //     throw new HttpException(
  //       { error: 'User not found', status: HttpStatus.NOT_FOUND },
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  //   user.email = email;
  //   user.name = name;
  //   user.role = role;
  //   user.team = team;
  //   await user.save();

  //   return {
  //     id: user.id,
  //     email: user.email,
  //     name: user.name,
  //     role: user.role,
  //     team: user.team,
  //   };
  // }
}
