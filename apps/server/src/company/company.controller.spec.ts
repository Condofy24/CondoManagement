import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

interface CompanyDTO {
  _id?: string;
  companyName?: string;
  companyLocation?: string;
  companyId?: string;
}

const testCompany1 = 'Test Company 1';
const testLocation1 = 'Test Location 1';

describe('Company Controller', () => {
  let controller: CompanyController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: {
            findAll: jest
              .fn<CompanyDTO[], unknown[]>()
              .mockImplementation(() => [
                {
                  companyName: testCompany1,
                  companyLocation: testLocation1,
                  companyId: '1',
                },
                {
                  companyName: 'Test Company 2',
                  companyLocation: 'Test Location 2',
                  companyId: '2',
                },
                {
                  companyName: 'Test Company 3',
                  companyLocation: 'Test Location 3',
                  companyId: '3',
                },
              ]),
            findOne: jest
              .fn<Promise<CompanyDTO>, string[]>()
              .mockImplementation((id) =>
                Promise.resolve({
                  companyName: testCompany1,
                  companyLocation: testLocation1,
                  companyId: '1',
                  _id: id,
                }),
              ),
            findOneByName: jest
              .fn<Promise<CompanyDTO>, string[]>()
              .mockImplementation((companyName) => {
                return Promise.resolve({
                  companyName,
                  companyLocation: testLocation1,
                  companyId: '1',
                });
              }),
            insertOne: jest
              .fn<Promise<CompanyDTO>, CompanyDTO[]>()
              .mockImplementation((company) =>
                Promise.resolve({ _id: 'a uuid', ...company }),
              ),
            updateOne: jest
              .fn<Promise<CompanyDTO>, CompanyDTO[]>()
              .mockImplementation((company) =>
                Promise.resolve({ _id: 'a uuid', ...company }),
              ),
          },
        },
      ],
    }).compile();

    controller = module.get(CompanyController);
    service = module.get(CompanyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCompanies', () => {
    it('should get an array of companies', () => {
      expect(controller.getAllComapnies()).toEqual([
        {
          companyName: testCompany1,
          companyLocation: testLocation1,
          companyId: '1',
        },
        {
          companyName: 'Test Company 2',
          companyLocation: 'Test Location 2',
          companyId: '2',
        },
        {
          companyName: 'Test Company 3',
          companyLocation: 'Test Location 3',
          companyId: '3',
        },
      ]);
    });
  });

  describe('getById', () => {
    it('should get a single company', () => {
      expect(controller.getCompany('a strange id')).resolves.toEqual({
        companyName: testCompany1,
        companyLocation: testLocation1,
        companyId: '1',
        _id: 'a strange id',
      });
      expect(controller.getCompany('a different id')).resolves.toEqual({
        companyName: testCompany1,
        companyLocation: testLocation1,
        companyId: '1',
        _id: 'a different id',
      });
    });
  });
});
