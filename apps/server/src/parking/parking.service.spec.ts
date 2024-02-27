import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UnitService } from '../unit/unit.service';
import { BuildingService } from '../building/building.service';
import { ObjectId } from 'mongodb';
import { Building } from '../building/entities/building.entity';
import { CreateParkingDto } from './dto/create-parking.dto';
import { ParkingService } from './parking.service';
import { Parking, ParkingModel } from './entities/parking.entity';
import { create } from 'domain';
import { HttpException } from '@nestjs/common';
import { Unit } from 'src/unit/entities/unit.entity';

const mockingoose = require('mockingoose')

const createParkingDto: CreateParkingDto = {
    parkingNumber:4,
    isOccupied: false,
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

const occupiedUnitInfoTestData: Unit = {
    buildingId: new ObjectId(),
    ownerId: new ObjectId(),
    renterId: new ObjectId,
    unitNumber: 5,
    size: 4.5,
    isOccupiedByRenter: true,
    fees: 500
}

const parkingInfoTestData: Parking ={
    buildingId: new ObjectId(),
    parkingNumber: 40,
    isOccupied: false,
    fees: 12.50
}

const buildingServiceMock = {
    findOne: jest.fn().mockResolvedValue(buildingInfoTestData),
    findByIdandUpdateParkingCount: jest.fn().mockResolvedValue(null),
}

const unitServiceMock = {
    findOne: jest.fn().mockResolvedValue(occupiedUnitInfoTestData)
}

describe('ParkingService', () => {
    let service: ParkingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers:[
                ParkingService,
                {
                    provide: getModelToken('Parking'),
                    useValue: ParkingModel

                },
                {
                    provide: BuildingService,
                    useValue:buildingServiceMock
                },
                {
                    provide: UnitService,
                    useValue: unitServiceMock
                },
            ]
        }).compile();
        service = module.get<ParkingService>(ParkingService);
    });

    afterEach(() => {
        mockingoose(ParkingModel).reset();
        jest.clearAllMocks();
    });

    describe('createParking', () => {
        it('should create a Parking successfully if information is valid', async () => {
            //Arrange
            mockingoose(ParkingModel).toReturn(null,'findOne');
            const id = new ObjectId();
            buildingServiceMock.findOne.mockResolvedValue({id,...buildingInfoTestData})

            //Act
            const result: any = await service.createParking(id.toString(),createParkingDto);

            //Assert
            expect(buildingServiceMock.findByIdandUpdateParkingCount).toHaveBeenCalled();
            expect(result).toBeDefined();
        });
        it('should throw an error if building does not exist', async () => {
            //Arrange
            mockingoose(ParkingModel).toReturn(null,'findOne');
            const id = new ObjectId();
            buildingServiceMock.findOne.mockResolvedValue(null)

            //Act and Assert
            await expect(service.createParking(id.toString(),createParkingDto)).rejects.toThrow(
                HttpException
            );
        })
        it('should throw an error if parking number already exists', async () => {
            // Arrange
            const id = new ObjectId();
            buildingServiceMock.findOne.mockResolvedValue({ id, ...buildingInfoTestData });
            mockingoose(ParkingModel).toReturn({...parkingInfoTestData, buildingId: id}, 'findOne');

             // Act and Assert
            await expect(service.createParking(id.toString(), createParkingDto)).rejects.toThrow(
                HttpException
            );
        }); 
    })    
});