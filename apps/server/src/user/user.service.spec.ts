import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { User } from './entities/user.entity';
import { UserRolesEnum } from './user.model';
import { Model } from 'mongoose';
import { CompanyService } from '../company/company.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateManagerDto } from './dto/create-manager.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

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
const mockUserModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  create: jest.fn().mockResolvedValue(mockUser),
  remove: jest.fn(),
  exec: jest.fn(),
  save: jest.fn(),
  findByIdAndDelete: jest.fn(),
  exists: jest.fn().mockResolvedValue(false),
};

// Mocked Cloudinary service
const mockCloudinaryService = {
  uploadFile: jest.fn().mockResolvedValue({
    secure_url: 'https://example.com/image.jpg',
    public_id: '12345',
  }),
};

// Mocked Company service
const mockCompanyService = {
  findByCompanyName: jest.fn().mockResolvedValue(null),
  createCompany: jest.fn().mockResolvedValue({ companyId: 'company123' }),
  findByCompanyId: jest.fn().mockResolvedValue(true),
};

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;
  let companyService: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
        {
          provide: CompanyService,
          useValue: mockCompanyService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken('User'));
    companyService = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createManager', () => {
    it('should create a new manager', async () => {
      jest.spyOn(userModel, 'create').mockImplementationOnce(() =>
        Promise.resolve({
          email: 'manager@example.com',
          password: 'password123',
          name: 'Manager Name',
          phoneNumber: '9876543210',
          companyId: 'ABC123',
          role: '0',
        }),
      );
      // const createManagerDto: CreateManagerDto = {
      //   email: 'manager@example.com',
      //   password: 'password123',
      //   name: 'Manager Name',
      //   phoneNumber: '9876543210',
      //   companyLocation: 'Location',
      //   companyName: 'Company Name',
      //   email,
      // password,
      // name,
      // companyId,
      // role: 0,
      // phoneNumber,
      // imageUrl,
      // imageId,
      // };

      const newManager = await service.createManager({
        email: 'manager@example.com',
        password: 'password123',
        name: 'Manager Name',
        phoneNumber: '9876543210',
        companyLocation: 'sad',
        companyName: 'sadsa',
      }); // Role set to 0 for manager

      // const createSpy = jest.spyOn(mockUserModel, 'create');
      // createSpy.mockResolvedValue(mockManager); // Mock the create method

      // const result = await service.createManager(createManagerDto);
      expect(newManager).toEqual(
        mockUser(
          'test',
          'manager@example.com',
          'password123',
          'Manager Name',
          UserRolesEnum.MANAGER,
          '9876543210',
          'https://gssc.esa.int/navipedia/index.php?title=File:Example.jpg',
          '123456',
          'ABC123',
        ),
      );
      // expect(result).toBeDefined();
      // expect(result).toHaveProperty('status', HttpStatus.CREATED);
      // Add additional assertions if needed
    });

    it('should throw an error if company already exists', async () => {
      mockCompanyService.findByCompanyName.mockResolvedValue(true);
      const createManagerDto: CreateManagerDto = {
        email: 'manager@example.com',
        password: 'password123',
        name: 'Manager Name',
        phoneNumber: '9876543210',
        companyLocation: 'Location',
        companyName: 'Company Name',
      };

      await expect(service.createManager(createManagerDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if phone number is invalid', async () => {
      const createManagerDto: CreateManagerDto = {
        email: 'manager@example.com',
        password: 'password123',
        name: 'Manager Name',
        phoneNumber: '12345', // Invalid phone number
        companyLocation: 'Location',
        companyName: 'Company Name',
      };

      await expect(service.createManager(createManagerDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('createEmployee', () => {
    it('should create a new employee', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        email: 'employee@example.com',
        name: 'Employee Name',
        role: '1',
        companyId: 'company123',
        phoneNumber: '1234567890',
      };

      const result = await service.createEmployee(createEmployeeDto);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('status', HttpStatus.CREATED);
    });

    it('should throw an error if company does not exist', async () => {
      mockCompanyService.findByCompanyId.mockResolvedValue(false);
      const createEmployeeDto: CreateEmployeeDto = {
        email: 'employee@example.com',
        name: 'Employee Name',
        role: '1',
        companyId: 'invalidCompanyId',
        phoneNumber: '1234567890',
      };

      await expect(service.createEmployee(createEmployeeDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if role is invalid', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        email: 'employee@example.com',
        name: 'Employee Name',
        role: '6', // Invalid role
        companyId: 'company123',
        phoneNumber: '1234567890',
      };

      await expect(service.createEmployee(createEmployeeDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'user@example.com',
        password: 'password123',
        name: 'User Name',
        role: '2',
        phoneNumber: '9876543210',
      };

      const result = await service.createUser(createUserDto);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('status', HttpStatus.CREATED);
    });

    it('should throw an error if email or phone number already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
        role: '2',
        phoneNumber: '1234567890',
      };

      (userModel.exists as jest.Mock).mockResolvedValue(true);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if phone number is invalid', async () => {
      const createUserDto: CreateUserDto = {
        email: 'user@example.com',
        password: 'password123',
        name: 'User Name',
        role: '2',
        phoneNumber: '12345', // Invalid phone number
      };

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if role is invalid', async () => {
      const createUserDto: CreateUserDto = {
        email: 'user@example.com',
        password: 'password123',
        name: 'User Name',
        role: '6', // Invalid role
        phoneNumber: '9876543210',
      };

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  // Add more test cases for other methods as needed

  afterEach(() => {
    jest.clearAllMocks();
  });
});
