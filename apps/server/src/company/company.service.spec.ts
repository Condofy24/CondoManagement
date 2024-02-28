import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CompanyService } from './company.service';
import { Model, Query } from 'mongoose';
import { CompanyDoc } from './interfaces/company-document.interface';
import { createMock } from '@golevelup/ts-jest';
import { HttpException, HttpStatus } from '@nestjs/common';
// import { UpdateCompanyDto } from './dto/update-company.dto';

export interface MyCompany {
  companyName: string;
  companyLocation: string;
  id: string;
}

const mockCompany = (
  companyName = 'Test Company',
  companyLocation = 'test',
  id = '1',
): MyCompany => ({
  companyName,
  companyLocation,
  id,
});

const mockCompanyDoc = (mock?: Partial<MyCompany>): Partial<CompanyDoc> => ({
  companyName: mock?.companyName || 'Test Company',
  companyLocation: mock?.companyLocation || 'test',
  _id: mock?.id || '1',
});

const companyArray = [
  mockCompany(),
  mockCompany('Test Company 1', 'test', '2'),
  mockCompany('Test Company 2', 'test', '3'),
];

const companyDocArray: Partial<CompanyDoc>[] = [
  mockCompanyDoc(),
  mockCompanyDoc({
    companyName: 'Test Company 1',
    companyLocation: 'test',
    id: '2',
  }),
  mockCompanyDoc({
    companyName: 'Test Company 2',
    companyLocation: 'test',
    id: '3',
  }),
];

describe('CompanyService', () => {
  let service: CompanyService;
  let model: Model<MyCompany>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: getModelToken('Company'),
          useValue: {
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    model = module.get<Model<MyCompany>>(getModelToken('Company'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all companies', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(companyDocArray),
    } as unknown as Query<CompanyDoc[], CompanyDoc>);
    const companies = await service.findAll();
    expect(companies).toEqual(companyArray);
  });

  it('should getOne by id', async () => {
    const id = '3';
    const mockCompany = mockCompanyDoc({
      companyName: 'Test Company 2',
      id: id,
    });

    jest.spyOn(model, 'findById').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockCompany),
    } as any);

    const foundCompany = await service.findOne(id);

    expect(foundCompany).toEqual({
      id: mockCompany._id,
      companyName: mockCompany.companyName,
      companyLocation: mockCompany.companyLocation,
    });
  });

  it('should getOne by CompanyName', async () => {
    const mockCompanyName = 'test';
    const mockCompany = mockCompanyDoc({
      companyName: mockCompanyName,
    });

    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockCompany),
    } as any);

    const foundCompany = await service.findByCompanyName(mockCompanyName);

    expect(foundCompany).toEqual({
      id: mockCompany._id,
      companyName: mockCompany.companyName,
      companyLocation: mockCompany.companyLocation,
    });
  });

  it('should throw HttpException when updating a non-existing company', async () => {
    jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce(
      createMock<Query<CompanyDoc, CompanyDoc>>({
        exec: jest.fn().mockResolvedValueOnce(null),
      }),
    );

    try {
      await service.updateCompany('invalid-id', {
        companyName: 'Updated Company',
        companyLocation: 'Updated Location',
      });
      fail('Expected HttpException to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Http Exception');
      expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
    }
  });

  it('should throw HttpException when updating a non-existing company', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<Query<CompanyDoc, CompanyDoc>>({
        exec: jest.fn().mockResolvedValueOnce(null),
      }),
    );

    try {
      await service.createCompany({
        companyName: 'Updated Company',
        companyLocation: 'Updated Location',
      });
      fail('Expected HttpException to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Http Exception');
      expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    }
  });
});
