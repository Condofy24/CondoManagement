import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';

interface CompanyDTO {
  _id?: string;
  companyName?: string;
  companyLocation?: string;
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
            findCompanyById: jest
              .fn<Promise<CompanyDTO>, string[]>()
              .mockImplementation((id) =>
                Promise.resolve({
                  companyName: testCompany1,
                  companyLocation: testLocation1,
                  _id: id,
                }),
              ),
            findCompanyByName: jest
              .fn<Promise<CompanyDTO>, string[]>()
              .mockImplementation((companyName) => {
                return Promise.resolve({
                  companyName,
                  companyLocation: testLocation1,
                });
              }),
            createCompany: jest
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

  describe('getById', () => {
    it('should get a single company', () => {
      expect(controller.getCompany('a strange id')).resolves.toEqual({
        companyName: testCompany1,
        companyLocation: testLocation1,
        _id: 'a strange id',
      });
      expect(controller.getCompany('a different id')).resolves.toEqual({
        companyName: testCompany1,
        companyLocation: testLocation1,
        _id: 'a different id',
      });
    });
  });

  describe('getByCompanyName', () => {
    it('should get a company back', async () => {
      await expect(controller.getByCompanyName(testCompany1)).resolves.toEqual({
        companyName: testCompany1,
        companyLocation: testLocation1,
      });
    });
  });

  describe('newCompany', () => {
    it('should create a new company', () => {
      const newCompanyDto: CreateCompanyDto = {
        companyName: 'A new company',
        companyLocation: 'A new location',
      };

      expect(controller.create(newCompanyDto)).resolves.toEqual({
        _id: 'a uuid',
        ...newCompanyDto,
      });
    });
  });
});
