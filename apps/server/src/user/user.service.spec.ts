import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { User } from './entities/user.entity';
import { UserRolesEnum } from './user.model';
import { Model } from 'mongoose';
import { CompanyService } from '../company/company.service';

const mockUser = (
  id = 'test',
  email = 'test@gmail.com',
  password = 'test',
  name = 'John Doe',
  role = UserRolesEnum.OWNER,
  phoneNumber = '1234567890',
  imageUrl = 'https://gssc.esa.int/navipedia/index.php?title=File:Example.jpg',
  imageId = '123456',
  companyId = '123456',
): User => ({
  id,
  email,
  password,
  name,
  role,
  phoneNumber,
  imageUrl,
  imageId,
  companyId,
});

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;
  let companyService: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser()),
            constructor: jest.fn().mockResolvedValue(mockUser()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
        CloudinaryService,
        CompanyService,
        {
          provide: getModelToken('Company'),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken('User'));
    companyService = module.get<CompanyService>(CompanyService); 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
