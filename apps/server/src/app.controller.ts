import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './user/cloudinary/cloudinary.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Keeping this for now for testing purpose
  // @Post()
  // @UseInterceptors(FileInterceptor('file'))
  // uploadImage(@UploadedFile() file: Express.Multer.File) {
  //   return this.cloudinaryService.uploadFile(file);
  // }
}
