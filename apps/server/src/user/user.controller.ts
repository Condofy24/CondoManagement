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

  @Post('manager')
  @UseInterceptors(FileInterceptor('image'))
  createManager(
    @Body() createManagerDto: CreateManagerDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.userService.createManager(createManagerDto, image);
  }

  @Post('employee')
  @UseGuards(PrivilegeGuard)
  @Roles(0)
  createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.userService.createEmployee(createEmployeeDto);
  }

  @Get('users')
  findAll() {
    return this.userService.findAll();
  }

  // @UseGuards(AuthGuard) -- Comment for testing
  @Get('profile')
  getProfile(@Request() req: any) {
    return this.userService.getProfile(req.user);
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.userService.findOne(email);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

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
