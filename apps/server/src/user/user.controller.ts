import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UseGuards,
  Delete,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard, PrivilegeGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateManagerDto } from './dto/create-manager.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UserModel } from './models/user.model';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ description: 'User created' })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<UserModel> {
    return new UserModel(
      await this.userService.createUser(createUserDto, image),
    );
  }

  /**
   * Create a new manager.
   * @param createManagerDto - The data for creating a manager.
   * @param image - The uploaded image file.
   * @returns The created manager.
   */
  @Post('manager')
  @ApiCreatedResponse({ description: 'Manager created' })
  @UseInterceptors(FileInterceptor('image'))
  async createManager(
    @Body() createManagerDto: CreateManagerDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<UserModel> {
    return new UserModel(
      await this.userService.createManager(createManagerDto, image),
    );
  }

  /**
   * Create a new employee.
   * @param createEmployeeDto - The data for creating an employee.
   * @returns The created employee.
   */
  @Post('employee')
  @UseGuards(PrivilegeGuard)
  @ApiCreatedResponse({ description: 'Employee created' })
  @Roles(0)
  async createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<UserModel> {
    return new UserModel(
      await this.userService.createEmployee(createEmployeeDto),
    );
  }

  /**
   * Manager gets all company employees
   * @returns All employees of a company.
   */
  @Get('employees/:companyId')
  async findEmployees(@Param('companyId') companyId: string) {
    return (await this.userService.findAll({ companyId })).map(
      (user) => new UserModel(user),
    );
  }

  /**
   * Get the profile of the authenticated user.
   * @param req - The request object.
   * @returns The profile of the authenticated user.
   */
  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@Request() req: any): Promise<UserModel> {
    const userEntity = await this.userService.findUserById(req.user.sub);

    if (!userEntity) throw new NotFoundException('User not found');

    return new UserModel(userEntity);
  }

  /**
   * Remove a user by ID.
   * @param id - The ID of the user to remove.
   * @returns The removed user.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  /**
   * Update a user by ID.
   * @param id - The ID of the user to update.
   * @param updateUserDto - The data for updating the user.
   * @param image - The uploaded image file.
   * @returns The updated user.
   */
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.userService.updateUser(id, updateUserDto, image);
  }
}
