import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CloudinaryService } from './user/cloudinary/cloudinary.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
