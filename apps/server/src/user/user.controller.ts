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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrivilegeGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateManagerDto } from './dto/create-manager.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.userService.createUser(createUserDto, image);
  }

  /**
   * Create a new manager.
   * @param createManagerDto - The data for creating a manager.
   * @param image - The uploaded image file.
   * @returns The created manager.
   */
  @Post('manager')
  @UseInterceptors(FileInterceptor('image'))
  createManager(
    @Body() createManagerDto: CreateManagerDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.userService.createManager(createManagerDto, image);
  }

  /**
   * Create a new employee.
   * @param createEmployeeDto - The data for creating an employee.
   * @returns The created employee.
   */
  @Post('employee')
  @UseGuards(PrivilegeGuard)
  @Roles(0)
  createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.userService.createEmployee(createEmployeeDto);
  }

  /**
   * Get all users.
   * @returns All users.
   */
  @Get('users')
  findAll() {
    return this.userService.findAll();
  }

  /**
   * Manager gets all company employees
   * @returns All employees of a company.
   */
  @Get('employees/:companyId')
  findEmployees(@Param('companyId') companyId: string) {
    return this.userService.findAll({ companyId });
  }

  /**
   * Get the profile of the authenticated user.
   * @param req - The request object.
   * @returns The profile of the authenticated user.
   */
  @Get('profile')
  getProfile(@Request() req: any) {
    return this.userService.getProfile(req.user);
  }

  /**
   * Find a user by email.
   * @param email - The email of the user to find.
   * @returns The found user.
   */
  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.userService.findOne(email);
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

  // TODO: Manager should be able to modify his employees
  // @UseGuards(PrivilegeGuard)
  // @Patch('admin/:id')
  // updateUserByAdmin(
  //   @Param('id') id: string,
  //   @Body() updateUserDto: UpdateUserDtoByAdmin,
  // ) {
  //   return this.userService.updateUserByAdmin(id, updateUserDto);
  // }
}
