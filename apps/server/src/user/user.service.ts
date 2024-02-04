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
import { Token, UserProfile } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private cloudinary: CloudinaryService,
  ) {}

  async uploadImageToCloudinary(file: Express.Multer.File) {
    try {
      const imageResponse = await this.cloudinary.uploadFile(file);
      return imageResponse;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw new BadRequestException('Failed to upload image to Cloudinary.');
    }
  }
  public async createUser(
    createUserDto: CreateUserDto,
    image?: Express.Multer.File,
  ) {
    const { email, password, name, role, phoneNumber } = createUserDto;

    // Check user doesn't already exist
    const isUserAlreadyExist = await this.userModel.exists({ email: email });
    if (!!isUserAlreadyExist) {
      throw new HttpException(
        { error: 'User already exists', status: HttpStatus.CONFLICT },
        HttpStatus.CONFLICT,
      );
    }
    // Check phone number doesn't already exist
    const isPhoneNumberValid = await this.userModel.exists({
      phoneNumber: phoneNumber,
    });
    if (phoneNumber.length < 10 || !/^\d+$/.test(phoneNumber)) {
      throw new HttpException(
        {
          error: 'Invalid phone number format or length',
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    } else if (!!isPhoneNumberValid) {
      throw new HttpException(
        {
          error: 'Phone number already linked to another user',
          status: HttpStatus.CONFLICT,
        },
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
      role,
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
    return this.userModel.findOne({ email: userEmail });
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
    const users = await this.userModel.find();
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

  public async remove(id: String): Promise<any> {
    try {
      await this.userModel.findByIdAndDelete(id);
    } catch {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return response.status(HttpStatus.NO_CONTENT);
  }

  public async getPrivilege(id: string): Promise<Number | undefined> {
    const user = await this.userModel.findById(id);
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
    const isPhoneNumberValid = await this.userModel.exists({
      phoneNumber: phoneNumber,
    });
    //Still need to validate the input is numbers
    if (phoneNumber.length < 10 || !/^\d+$/.test(phoneNumber)) {
      throw new HttpException(
        {
          error: 'Invalid phone number format or length',
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    } else if (!!isPhoneNumberValid) {
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
