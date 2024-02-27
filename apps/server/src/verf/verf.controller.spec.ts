import { Test, TestingModule } from '@nestjs/testing';
import { VerfService } from '../verf/verf.service';
import { VerfController } from './verf.controller';
import { ObjectId } from 'mongodb';
import { VerfRolesEnum } from './entities/verf.entity';
import { PrivilegeGuard } from '../auth/auth.guard';


const verfKeyResponseMock = {
  id: new ObjectId(),
  unitId: new ObjectId('65dd47046d122514e4ccc0b6'),
  key: 'qwerty',
  type: VerfRolesEnum.OWNER,
  claimedBy: 'EA',
};

const mockYourService = {
  findByUnitId: jest.fn().mockResolvedValue([verfKeyResponseMock])
};


describe('VerfController', () => {
  let controller: VerfController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

      controllers: [VerfController],
      providers: [

        {
          provide: VerfService, // Use the correct model token
          useValue: mockYourService,
        },
      ],
    }).overrideGuard(PrivilegeGuard) // Override the actual PrivilegeGuard
    .useValue({ canActivate: () => true }) .compile();

    controller = module.get<VerfController>(VerfController);
  });
  
  describe('findKeysByUnit', () => {
    it('should call verfService.findByUnitId with correct unitId', async() => {
      
      const unitId = '65dd47046d122514e4ccc0b6';

      await controller.findKeysByUnit(unitId);

      expect(mockYourService.findByUnitId).toHaveBeenCalledWith(unitId);
    });
  });

  it('should be defined', () => {
    
    expect(controller).toBeDefined();
  });
});

