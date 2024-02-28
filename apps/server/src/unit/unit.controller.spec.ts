import { Test, TestingModule } from '@nestjs/testing';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';
import { CreateUnitDto } from './dto/create-unit.dto';
import { LinkUnitToBuidlingDto } from './dto/link-unit-to-building.dto';
import { ObjectId } from 'mongodb';
import { User } from '../user/entities/user.entity';
import { Unit } from './entities/unit.entity';
import { Building } from '../building/entities/building.entity';
import { HttpStatus } from '@nestjs/common';

const createUnitDto: CreateUnitDto = {
    unitNumber:4,
    size:4,
    isOccupiedByRenter: false,
    fees:4
}

const unitServiceMock = {
    createUnit:jest.fn(),
    linkUnitToUser:jest.fn(),
    remove:jest.fn()
}

const linkUnitToBuildingDto: LinkUnitToBuidlingDto = {
    unitNumber:4
}

const buildingInfoTestData: Building = {   
    companyId: new ObjectId(), 
    name:"khaled",
    address:"aslkdjfalk",
    unitCount:56,
    parkingCount:53,
    storageCount:52,
    fileUrl:"https://res.cloudinary.com/dzu5t20lr/image/upload/v1708240883/wfypsvm",
    filePublicId:"wfypsvm4kykgjtxxolbn",
    fileAssetId:"dc1dc5cbafbe598f40a9c1c8938e51c7"
}

const buildingInfoTestData2 = {
    id:new ObjectId(),
    companyId: new ObjectId(), 
    name:"khaled",
    address:"aslkdjfalk",
    unitCount:56,
    parkingCount:53,
    storageCount:52,
    fileUrl:"https://res.cloudinary.com/dzu5t20lr/image/upload/v1708240883/wfypsvm",
    filePublicId:"wfypsvm4kykgjtxxolbn",
    fileAssetId:"dc1dc5cbafbe598f40a9c1c8938e51c7"
}

const unitInfoTestData:Unit = {
    buildingId: buildingInfoTestData2.id,
    unitNumber: 4,
    size: 4,
    isOccupiedByRenter: false,
    fees: 4
}

const unitInfoTestData2 = {
    id:new ObjectId(),
    buildingId: buildingInfoTestData2.id,
    unitNumber: 4,
    size: 4,
    isOccupiedByRenter: false,
    fees: 4
}

const userInfoTestData:User = {
    id:'test',
    password:'test',
    email: 'user@example.com',
    name: 'Test User',
    role: 4,
    phoneNumber: '1234567890',
    imageUrl: 'https://example.com/image.jpg',
    imageId: 'image123',
  };

  const userInfoTestData2:User = {
    id:'test',
    password:'test',
    email: 'user@example.com',
    name: 'Test User',
    role: 3,
    phoneNumber: '1234567890',
    imageUrl: 'https://example.com/image.jpg',
    imageId: 'image123',
  };

describe('UnitController',() => {
    let controller:UnitController;

    beforeEach(async ()=> {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UnitController],
            providers: [
              {
                provide: UnitService,
                useValue: unitServiceMock,
              },
            ],
        }).compile();
        controller = module.get<UnitController>(UnitController);
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    });
    describe('create',() => {
        it('should forward call to unit service', async () => {
            //Arrange
            unitServiceMock.createUnit.mockResolvedValue(
                unitInfoTestData
            )

            //Act
            const result = await controller.create(
                unitInfoTestData.buildingId.toString(),
                createUnitDto
            )

            //Assert
            expect(result).toEqual(unitInfoTestData);
        });
    })
    describe('linkUnitToUser',() => {
        it('should forward call to unit service', async () => {
            //Arrange
            unitServiceMock.linkUnitToUser.mockResolvedValue(
                unitInfoTestData
            )

            //Act
            const result = await controller.linkUnitToUser(
                unitInfoTestData.buildingId.toString(),
                userInfoTestData.id,
                createUnitDto
            )

            //Assert
            expect(result).toEqual(unitInfoTestData);
        });
    })
    describe('remove',() => {
        it('should forward call to unit service', async () => {
            //Arrange
            unitServiceMock.remove.mockResolvedValue(
                HttpStatus.NO_CONTENT
            )

            //Act
            const result = await controller.remove(
                unitInfoTestData2.id.toString()
            )

            //Assert
            expect(result).toEqual(HttpStatus.NO_CONTENT);
        });
    })
})