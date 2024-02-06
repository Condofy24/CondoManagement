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
  companyId: string;
  id: string;
}

const mockCompany = (
  companyName = 'Test Company',
  companyLocation = 'test',
  companyId = '1',
  id = '1',
): MyCompany => ({
  companyName,
  companyLocation,
  companyId,
  id,
});

const mockCompanyDoc = (mock?: Partial<MyCompany>): Partial<CompanyDoc> => ({
  companyName: mock?.companyName || 'Test Company',
  companyLocation: mock?.companyLocation || 'test',
  companyId: mock?.companyId || '1',
  _id: mock?.id || '1',
});

const companyArray = [
  mockCompany(),
  mockCompany('Test Company 1', 'test', '2', '2'),
  mockCompany('Test Company 2', 'test', '3', '3'),
];

const companyDocArray: Partial<CompanyDoc>[] = [
  mockCompanyDoc(),
  mockCompanyDoc({
    companyName: 'Test Company 1',
    companyLocation: 'test',
    companyId: '2',
    id: '2',
  }),
  mockCompanyDoc({
    companyName: 'Test Company 2',
    companyLocation: 'test',
    companyId: '3',
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
      companyId: mockCompany.companyId,
    });
  });

  it('should getOne by CompanyId', async () => {
    const mockCompanyId = '3';
    const mockCompany = mockCompanyDoc({
      companyName: 'Test Company 2',
      companyId: mockCompanyId,
    });

    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockCompany),
    } as any);

    const foundCompany = await service.findByCompanyId(mockCompanyId);

    expect(foundCompany).toEqual({
      id: mockCompany._id,
      companyName: mockCompany.companyName,
      companyLocation: mockCompany.companyLocation,
      companyId: mockCompany.companyId,
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

  /*  it('should update a company successfully', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<Query<CompanyDoc, CompanyDoc>>({
        exec: jest.fn().mockResolvedValueOnce({
          id: '1',
          companyName: 'Original Company',
          companyLocation: 'Original Location',
          companyId: '1',
        }),
      }),
    );

    const updateCompanyDto: UpdateCompanyDto = {
      companyName: 'Updated Company',
      companyLocation: 'Updated Location',
    };

    const updatedCat = await service.updateCompany('1', updateCompanyDto);
    expect(updatedCat).toEqual({
      id: '1',
      ...updateCompanyDto,
      companyId: '1',
    });
  });
*/
});
