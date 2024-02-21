import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserModel } from './entities/user.entity';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { UserService } from './user.service';
import { HttpException } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { Readable } from 'stream';
import { buffer } from 'stream/consumers';
const mockingoose = require('mockingoose');

const cloudinaryServiceMock = {
  uploadFile: jest.fn().mockResolvedValue({
    secure_url: 'mockSecureUrl',
    public_id: 'mockPublicId',
  }),
};

const companyServiceMock = {
  findByCompanyName: jest.fn().mockResolvedValue(null),
  createCompany: jest.fn().mockResolvedValue({ companyId: 'mockCompanyId' }),
};

const createManagerDto: CreateManagerDto = {
  email: 'test@example.com',
  password: 'password',
  name: 'Test Manager',
  phoneNumber: '1234567890',
  companyLocation: 'Test Location',
  companyName: 'Test Company',
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: UserModel,
        },
        {
          provide: CloudinaryService,
          useValue: cloudinaryServiceMock,
        },
        {
          provide: CompanyService,
          useValue: companyServiceMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    mockingoose(UserModel).reset();
    jest.clearAllMocks();
  });

  describe('createManager', () => {
    it('should create a manager successfully if information is valid', async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, 'findOne');
      companyServiceMock.findByCompanyName.mockResolvedValue(false);
      companyServiceMock.createCompany.mockResolvedValue({
        companyId: 'mockId',
      });

      // Act
      const result: any = await service.createManager(createManagerDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.statusCode).toBe(201);
    });

    it('should throw an error if email already exists', async () => {
      // Arrange
      mockingoose(UserModel).toReturn({ _id: 'test' }, 'findOne');

      // Act & Assert
      await expect(service.createManager(createManagerDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if company already exists', async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, 'findOne');
      companyServiceMock.findByCompanyName.mockResolvedValue(true);

      // Act & Assert
      await expect(service.createManager(createManagerDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should create company if information is valid', async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, 'findOne');
      companyServiceMock.findByCompanyName.mockResolvedValue(false);

      // Act
      await service.createManager(createManagerDto);

      // Asssert
      expect(companyServiceMock.createCompany).toHaveBeenCalledWith({
        companyName: createManagerDto.companyName,
        companyLocation: createManagerDto.companyLocation,
      });
    });

    it('should upload profile image if its valid', async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, 'findOne');
      companyServiceMock.findByCompanyName.mockResolvedValue(false);
      companyServiceMock.createCompany.mockResolvedValue({
        companyId: 'mockId',
      });

      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        destination: 'uploads/',
        filename: 'test.jpg',
        path: 'uploads/test.jpg',
        buffer: Buffer.from('some buffer data', 'utf-8'),
        stream: new Readable({
          read() {
            this.push(buffer);
            this.push(null);
          },
        }),
      };

      // Act
      await service.createManager(createManagerDto, mockFile);

      // Assert
      expect(cloudinaryServiceMock.uploadFile).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('findOne', () => {
    it('should find a user by email', async () => {
      // Arrange
      mockingoose(UserModel).toReturn({ _id: 'test' }, 'findOne');

      // Act
      await service.findOne('test');

      // Arrange
      await expect(service.findOne('test')).resolves.toBeDefined();
    });
  });

  describe('getProfile', () => {
    it('should throw an exception if user doesnt exist', async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, 'findOne');

      // Act
      expect(service.getProfile({ sub: 't', iat: 1, exp: 2 })).rejects.toThrow(
        HttpException,
      );
    });

    it('should return user information if user exists', async () => {
      // Arrange
      const userInfo = {
        email: 'test@example.com',
        name: 'Test User',
        role: 'Admin',
        phoneNumber: '1234567890',
        imageUrl: 'https://example.com/image.jpg',
        imageId: 'image123',
      };

      mockingoose(UserModel).toReturn(userInfo, 'findOne');

      // Act
      const result = await service.getProfile({ sub: 't', iat: 1, exp: 2 });

      // Assert
      expect(result).toEqual(expect.objectContaining({ ...userInfo, role: 3 }));
    });
  });

  //
  //   describe('createEmployee', () => {
  //     it('should create an employee successfully', async () => {
  //       // Arrange
  //       mockingoose(User).toReturn(null, 'exists');
  //
  //       // Act
  //       const result = await service.createEmployee(createEmployeeDto);
  //
  //       // Asssert
  //       expect(result).toBeDefined();
  //       expect(result.status).toBe(201);
  //     });
  //
  //     // Add more tests to cover failure cases
  //   });
  //
  //   describe('createUser', () => {
  //     it('should create a user successfully', async () => {
  //       // Implement similar to createManager
  //     });
  //
  //     // Add more tests
  //   });
  //
  //   describe('findOne', () => {
  //     it('should find a user by email', async () => {
  //       const mockUser = {
  //         _id: 'someUserId',
  //         email: 'test@example.com',
  //         name: 'Test User',
  //         // include other fields as necessary
  //       };
  //
  //       mockingoose(User).toReturn(mockUser, 'findOne');
  //
  //       const result = await service.findOne('test@example.com');
  //
  //       expect(result).toBeDefined();
  //       expect(result.email).toBe(mockUser.email);
  //     });
  //
  //     // Add more tests for not found cases
  //   });
  //
  //   // Implement additional tests for other methods as needed
});
