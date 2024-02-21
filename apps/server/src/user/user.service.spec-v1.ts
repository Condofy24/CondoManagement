import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { User, UserSchema } from './entities/user.entity';
import { UserRolesEnum } from './user.model';
import { Model, Mongoose, Query } from 'mongoose';
import { CompanyService } from '../company/company.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateManagerDto } from './dto/create-manager.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { UserDoc } from './interfaces/user-document.interface';
import { Readable } from 'node:stream';

export interface MyUser {
  id: string;
  email: string;
  //password: string;
  name: string;
  role: number;
  phoneNumber: string;
  imageUrl: string;
  imageId: string;
  companyId?: string;
}

const mockUser = (
  id = 'test',
  email = 'test@gmail.com',
  //password = 'test',
  name = 'John Doe',
  role = UserRolesEnum.OWNER,
  phoneNumber = '1234567890',
  imageUrl = 'https://res.cloudinary.com/dzu5t20lr/image/upload/v1706910325/m9ijj0xc1d2yzclssyzc.png',
  imageId = '123456',
  //companyId = '123456',
): MyUser => ({
  id,
  email,
  //password,
  name,
  role,
  phoneNumber,
  imageUrl,
  imageId,
  //companyId,
});

const mockUserDoc = (mock?: Partial<MyUser>): Partial<UserDoc> => ({
  id: mock?.id || 'test',
  email: mock?.email || 'test@gmail.com',
  // password: mock?.password || 'test',
  name: mock?.name || 'John Doe',
  role: mock?.role || UserRolesEnum.OWNER,
  phoneNumber: mock?.phoneNumber || '1234567890',
  imageUrl:
    mock?.imageUrl ||
    'https://res.cloudinary.com/dzu5t20lr/image/upload/v1706910325/m9ijj0xc1d2yzclssyzc.png',
  imageId: mock?.imageId || '123456',
  //companyId: mock?.companyId || '123456',
});

const userArray = [
  mockUser(),
  mockUser(
    'test2',
    'test.2@gmail.com',
    //'test2',
    'John Doe 2',
    UserRolesEnum.OWNER,
    '4382221122',
    'https://res.cloudinary.com/dzu5t20lr/image/upload/v1706910325/m9ijj0xc1d2yzclssyzc.png',
    '1234567',
    //'1234567',
  ),
  mockUser(
    'test3',
    'test.3@gmail.com',
    // 'test3',
    'John Doe 3',
    UserRolesEnum.ACCOUNTANT,
    '4382221127',
    'https://res.cloudinary.com/dzu5t20lr/image/upload/v1706910325/m9ijj0xc1d2yzclssyzc.png',
    '1234568',
    // '1234568',
  ),
];

const userDocArray: Partial<UserDoc>[] = [
  mockUserDoc(),
  mockUserDoc({
    id: 'test2',
    email: 'test.2@gmail.com',
    //password: 'test2',
    name: 'John Doe 2',
    role: UserRolesEnum.MANAGER,
    phoneNumber: '4382221122',
    imageUrl:
      'https://res.cloudinary.com/dzu5t20lr/image/upload/v1706910325/m9ijj0xc1d2yzclssyzc.png',
    imageId: '1234567',
    companyId: '1234567',
  }),
  mockUserDoc({
    id: 'test3',
    email: 'test.3@gmail.com',
    //password: 'test3',
    name: 'John Doe 3',
    role: UserRolesEnum.ACCOUNTANT,
    phoneNumber: '4382221127',
    imageUrl:
      'https://res.cloudinary.com/dzu5t20lr/image/upload/v1706910325/m9ijj0xc1d2yzclssyzc.png',
    imageId: '1234568',
    companyId: '1234568',
  }),
];

class mockUserModel {
  constructor(private data: any) {}
  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn().mockResolvedValue([]);
  static findOne = jest.fn().mockResolvedValue({});
  static findById = jest.fn().mockResolvedValue({});
  static updateUser = jest.fn().mockResolvedValue({});
  static createManager = jest.fn().mockResolvedValue({});
  static remove = jest.fn().mockResolvedValue([true]);
  static exec = jest.fn().mockResolvedValue([]);

  static findByIdAndDelete = jest.fn().mockResolvedValue([]);
  static findByIdAndUpdate = jest.fn().mockResolvedValue([]);
  static exists = jest.fn().mockResolvedValue([]);
}

// Mocked Cloudinary service
const mockCloudinaryService = {
  uploadFile: jest.fn().mockResolvedValue({
    secure_url:
      'https://res.cloudinary.com/dzu5t20lr/image/upload/v1706910325/m9ijj0xc1d2yzclssyzc.png',
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
  let model: Model<User>;
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
    model = module.get<Model<User>>(getModelToken('User'));
    companyService = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('uploadImageToCloudinary', () => {
    it('should upload an image to Cloudinary', async () => {
      // Mock the Express Multer file object
      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'image.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 12345,
        buffer: Buffer.from('mock-image-buffer'), // Mock image buffer
        destination: '',
        filename: '',
        path: '',
        stream: new Readable(),
      };

      // Call the uploadImageToCloudinary method
      const result = await service.uploadImageToCloudinary(file);

      // Verify that Cloudinary uploadFile method was called with the file
      expect(mockCloudinaryService.uploadFile).toHaveBeenCalledWith(file);

      // Verify that the result is returned correctly
      expect(result).toEqual({
        secure_url:
          'https://res.cloudinary.com/dzu5t20lr/image/upload/v1706910325/m9ijj0xc1d2yzclssyzc.png',
        public_id: '12345',
      });
    });

    it('should throw a BadRequestException if image upload to Cloudinary fails', async () => {
      // Mock the Express Multer file object
      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'image.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 12345,
        buffer: Buffer.from('mock-image-buffer'), // Mock image buffer
        destination: '',
        filename: '',
        path: '',
        stream: new Readable(),
      };

      // Mock Cloudinary uploadFile method to throw an error
      mockCloudinaryService.uploadFile.mockRejectedValueOnce(
        new Error('Upload failed'),
      );
    });
  });
  // Call the uploadImageToCloudinary method and
  describe('createManager', () => {
    it('should create a new manager', async () => {
      const createManagerDto: CreateManagerDto = {
        email: 'manasdagser@example.com',
        password: 'password123',
        name: 'Manager Name',
        phoneNumber: '9876235432120',
        companyLocation: 'sad',
        companyName: 'sadsa',
      };

      const newManager = await service.createManager(createManagerDto);
      expect(newManager).toBeDefined();
      // TODO: Check response status
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
    });
    it('should return all users', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(userDocArray),
      } as unknown as Query<UserDoc[], UserDoc>);

      const users = await service.findAll();

      expect(users).toEqual(userArray);
    });

    it('should getOne by id', async () => {
      const email = 'test.2@gmail.com';
      const mockUser = mockUserDoc({
        id: 'test2',
        email: email,
        //password: 'test2',
        name: 'John Doe 2',
        role: UserRolesEnum.MANAGER,
        phoneNumber: '4382221122',
        imageUrl:
          'https://res.cloudinary.com/dzu5t20lr/image/upload/v1706910325/m9ijj0xc1d2yzclssyzc.png',
        imageId: '1234567',
        companyId: '1234567',
      });

      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);

      const foundUser = await service.findOne(email);

      expect(foundUser).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        //password: mockUser.password,
        name: mockUser.name,
        role: mockUser.role,
        phoneNumber: mockUser.phoneNumber,
        imageUrl: mockUser.imageUrl,
        imageId: mockUser.imageId,
        companyId: mockUser.companyId,
      });
    });

    it('should throw HttpException when updating a non-existing user', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce(
        createMock<Query<UserDoc, UserDoc>>({
          exec: jest.fn().mockResolvedValueOnce(null),
        }),
      );
      try {
        await service.updateUser('invalid-id', {
          email: 'email',
          name: 'name',
          newPassword: 'newPassword',
          phoneNumber: '1234567890',
        });

        fail('Expected HttpException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Http Exception');
        expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
      }
    });

    it('should throw HttpException with HttpStatus.BAD_REQUEST for invalid phone number', async () => {
      const existingUserId = 'existing-id';
      const updateUserDto = {
        email: 'email@example.com',
        name: 'Updated Name',
        newPassword: 'newPassword',
        phoneNumber: '123', // Invalid phone number
      };

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce(
        createMock<Query<UserDoc, UserDoc>>({
          exec: jest.fn().mockResolvedValueOnce({ user: true }), // Simulating an existing user
        }),
      );

      try {
        await service.updateUser(existingUserId, updateUserDto);

        fail('Expected HttpException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Http Exception');
        expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
      }
    });

    it('should throw an error if email or phone number already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
        role: '2',
        phoneNumber: '1234567890',
      };
      jest
        .spyOn(model, 'exists')
        .mockImplementation(() => ({ _id: '00000' }) as any);

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
  describe('getPrivilege', () => {
    it('should return the user role if the user is found', async () => {
      const userId = 'testUserId';
      const userRole = 1; // Example user role
      const mockUser = {
        _id: userId,
        role: userRole,
      };

      jest.spyOn(model, 'findById').mockResolvedValueOnce(mockUser as any);

      const result = await service.getPrivilege(userId);

      expect(result).toEqual(userRole);
    });

    it('should return undefined if the user is not found', async () => {
      const userId = 'nonExistentUserId';

      jest.spyOn(model, 'findById').mockResolvedValueOnce(null);

      const result = await service.getPrivilege(userId);

      expect(result).toBeUndefined();
    });
  });

  // Add more test cases for other methods as needed

  afterEach(() => {
    jest.clearAllMocks();
  });
});
