import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { response } from 'express';
import { Token, UserProfile } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  public async createUser(createUserDto: CreateUserDto) {
    const { email, password, name, role } = createUserDto;

    // Check user doesn't already exist
    const isUserAlreadyExist = await this.userModel.exists({ email: email });
    if (!!isUserAlreadyExist) {
      throw new HttpException(
        { error: 'User already exists', status: HttpStatus.CONFLICT },
        HttpStatus.CONFLICT,
      );
    }

    // Create user
    const newUser = new this.userModel({ email, password, name, role });

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
  ): Promise<UserDto> {
    const { name, email, newPassword } = updateUserDto;

    // Find the user by id
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException(
        { error: 'User not found', status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    user.email = email;
    user.name = name;
    await user.save();

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
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
