import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { CloudinaryService } from './cloudinary/cloudinary.service'; // Import CloudinaryService
import { CompanyService } from '../company/company.service';
import { JwtService } from '@nestjs/jwt';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getModelToken('User'), // Use the correct model token
          useValue: {}, // Provide a mock value for UserModel
        },
        CloudinaryService,
        CompanyService,
        {
          provide: getModelToken('Company'),
          useValue: {},
        },
        JwtService,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
