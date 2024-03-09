import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CompanyService } from './company.service';
import CompanyDocumentModel, {
  CompanyUniqueLocationIndex,
  CompanyUniqueNameIndex,
} from './entities/company.entity';
import { MongoServerError, ObjectId } from 'mongodb';
import exp from 'constants';
import { BadRequestException } from '@nestjs/common';

const mockingoose = require('mockingoose');

const createCompanyTestDto = {
  companyName: 'Test Company',
  companyLocation: 'Test Location',
};

const companyEntity = {
  _id: new ObjectId(),
  name: 'Test Company',
  location: 'Test Location',
};

const mongoUniqueIndexException: MongoServerError = {
  addErrorLabel: (_) => {},
  hasErrorLabel: (_) => false,
  name: 'test',
  message: 'etst',
  errmsg: 'duplicate ID',
  errorLabels: [],
  code: 110000,
};

describe('CompanyService', () => {
  let service: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: getModelToken('Company'),
          useValue: CompanyDocumentModel,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCompany', () => {
    it('should create a company', async () => {
      // Arrange
      mockingoose(CompanyDocumentModel).toReturn(companyEntity, 'save');

      // Act
      const createdCompany = await service.createCompany(createCompanyTestDto);

      // Assert
      expect(createdCompany).toMatchObject(companyEntity);
    });

    it('should throw an error if the company name already exists', async () => {
      // Arrange
      const error = {
        ...mongoUniqueIndexException,
        message: CompanyUniqueNameIndex,
      };

      mockingoose(CompanyDocumentModel).toReturn((_: any) => {
        throw error;
      }, 'save');

      // Act
      await expect(service.createCompany(createCompanyTestDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if the company name already exists', async () => {
      // Arrange
      const error = {
        ...mongoUniqueIndexException,
        message: CompanyUniqueLocationIndex,
      };

      mockingoose(CompanyDocumentModel).toReturn((_: any) => {
        throw error;
      }, 'save');

      // Act
      await expect(service.createCompany(createCompanyTestDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findCompanyById', () => {
    it('should find a company by id', async () => {
      // Arrange
      mockingoose(CompanyDocumentModel).toReturn(companyEntity, 'findOne');

      // Act
      const company = await service.findCompanyById(
        companyEntity._id.toString(),
      );

      // Assert
      expect(company).toMatchObject(companyEntity);
    });
  });

  describe('findCompanyByName', () => {
    it('should find a company by name', async () => {
      // Arrange
      mockingoose(CompanyDocumentModel).toReturn(companyEntity, 'findOne');

      // Act
      const company = await service.findCompanyByName(companyEntity.name);

      // Assert
      expect(company).toMatchObject(companyEntity);
    });
  });
});
