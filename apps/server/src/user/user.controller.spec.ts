import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { CloudinaryService } from './cloudinary/cloudinary.service'; // Import CloudinaryService
import { CompanyService } from '../company/company.service';
import { JwtService } from '@nestjs/jwt';
import { VerfService } from '../verf/verf.service';
import { UnitService } from '../unit/unit.service';
import { BuildingService } from '../building/building.service';
import { StorageService } from '../storage/storage.service';
import { ParkingService } from '../parking/parking.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getModelToken('User'), // Use the correct model token
          useValue: {},
        },
        {
          provide: getModelToken('Storage'), // Use the correct model token
          useValue: {},
        },
        {
          provide: getModelToken('Parking'), // Use the correct model token
          useValue: {},
        },
        {
          provide: getModelToken('Unit'), // Use the correct model token
          useValue: {},
        },
        {
          provide: getModelToken('Company'), // Use the correct model token
          useValue: {},
        },
        {
          provide: getModelToken('VerificationKey'), // Use the correct model token
          useValue: {},
        },
        {
          provide: getModelToken('Building'), // Use the correct model token
          useValue: {},
        },
        CloudinaryService,
        VerfService,
        CompanyService,
        BuildingService,
        UnitService,
        JwtService,
        StorageService,
        ParkingService,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
