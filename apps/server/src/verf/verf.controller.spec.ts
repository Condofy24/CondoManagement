import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { VerfService } from '../verf/verf.service';
import { VerfController } from './verf.controller';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CloudinaryService } from '../user/cloudinary/cloudinary.service';
import { UnitService } from '../unit/unit.service';
import { BuildingService } from '../building/building.service';
import { CompanyService } from '../company/company.service';
import { StorageService } from '../storage/storage.service';
import { ParkingService } from '../parking/parking.service';


describe('VerfController', () => {
  let controller: VerfController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerfController],
      providers: [
        {
          provide: getModelToken('VerificationKey'), // Use the correct model token
          useValue: {},
        },
        {
          provide: getModelToken('User'), // Use the correct model token
          useValue: {},
        },
        {
          provide: getModelToken('Building'), // Use the correct model token
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
          provide: getModelToken('Company'), // Use the correct model token
          useValue: {},
        },
        {
          provide: getModelToken('Unit'), // Use the correct model token
          useValue: {},
        },
        CloudinaryService,
        VerfService,
        CompanyService,
        BuildingService,
        UnitService,
        JwtService,
        StorageService,
        UserService,
        ParkingService,
      ],
    }).compile();

    controller = module.get<VerfController>(VerfController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
