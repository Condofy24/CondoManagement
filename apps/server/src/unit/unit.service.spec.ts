import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UnitService } from './unit.service';
import { CloudinaryService } from '../user/cloudinary/cloudinary.service';
import { Unit, UnitModel } from './entities/unit.entity';
import { BadRequestException, HttpException } from '@nestjs/common';
import { Readable } from 'stream';
import { buffer } from 'stream/consumers';
import { CreateUnitDto } from './dto/create-unit.dto';
import { BuildingService } from '../building/building.service';
import { UserService } from '../user/user.service';
import { VerfService } from '../verf/verf.service';
import { ObjectId } from 'mongodb';
import { Building } from 'src/building/entities/building.entity';

const mockingoose = require('mockingoose')

const createUnitDto: CreateUnitDto = {
    unitNumber:4,
    size:4,
    isOccupiedByRenter: false,
    fees:4
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

const unitInfoTestData:Unit = {
    buildingId: new ObjectId(),
    unitNumber: 4,
    size: 4,
    isOccupiedByRenter: false,
    fees: 4
}

const verfServiceMock = {
    createVerfKey: jest.fn().mockResolvedValue({verificationkeyId:'mockVerificationKeyId'})
};

const buildingServiceMock = {
    findOne: jest.fn().mockResolvedValue(buildingInfoTestData),
    findByIdandUpdateUnitCount: jest.fn().mockResolvedValue(null),
}

const userServiceMock = {
    findById: jest.fn().mockResolvedValue(null),
}

describe('UnitService', () => {
    let service: UnitService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers:[
                UnitService,
                {
                    provide:getModelToken('Unit'),
                    useValue:UnitModel
                },
                {
                    provide: BuildingService,
                    useValue:buildingServiceMock
                },
                {
                    provide: UserService,
                    useValue:userServiceMock
                },
                {
                    provide:VerfService,
                    useValue:verfServiceMock
                }
            ]
        }).compile();
        service = module.get<UnitService>(UnitService);
    });

    afterEach(() => {
        mockingoose(UnitModel).reset();
        jest.clearAllMocks();
    });

    describe('createUnit', () => {
        it('should create a unit successfully if information is valid', async () => {
            //Arrange
            mockingoose(UnitModel).toReturn(null,'findOne');
            const id = new ObjectId();
            buildingServiceMock.findOne.mockResolvedValue({id,...buildingInfoTestData})

            //Act
            const result: any = await service.createUnit(id.toString(),createUnitDto);

            //Assert
            expect(result).toBeDefined();
            expect(verfServiceMock.createVerfKey).toHaveBeenCalledTimes(2);
        });
        it('should throw an error if building does not exist', async () => {
            //Arrange
            mockingoose(UnitModel).toReturn(null,'findOne');
            const id = new ObjectId();
            buildingServiceMock.findOne.mockResolvedValue(null)

            //Act and Assert
            await expect(service.createUnit(id.toString(),createUnitDto)).rejects.toThrow(
                HttpException
            );
        })
        it('should throw an error if unit already exists', async () => {
            //Arrange
            const id = unitInfoTestData.buildingId;
            buildingServiceMock.findOne.mockResolvedValue({id,...buildingInfoTestData})
            mockingoose(UnitModel).toReturn({id,...unitInfoTestData},'findOne');

            //Act and Assert
            await expect(service.createUnit(id.toString(),createUnitDto)).rejects.toThrow(
                HttpException
            );
        })
    });
    describe('findAll', () =>{
        it('should return all the units in a specific building given a valid buildingId', async () => {
            //Arrange
            const units = [unitInfoTestData];
            mockingoose(UnitModel).toReturn(units,'find');
            const id = unitInfoTestData.buildingId;
            
            //Act
            const result = await service.findAll(id.toString());
            
            //Assert
            expect(result.length).toBe(units.length);
            expect(result[0]).toEqual(
                expect.objectContaining({...unitInfoTestData})
            )
        })
    })
});


