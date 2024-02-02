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
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // TODO: Create controller for managers to create accounts for their employees

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.userService.createUser(createUserDto, image);
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
