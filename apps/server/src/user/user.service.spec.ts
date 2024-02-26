import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserModel } from './entities/user.entity';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { UserService } from './user.service';
import { BadRequestException, HttpException } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { Readable } from 'stream';
import { buffer } from 'stream/consumers';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const mockingoose = require('mockingoose');

const cloudinaryResponseMock = {
  secure_url: 'https://example.com/image.jpg',
  public_id: 'image123',
};

const cloudinaryServiceMock = {
  uploadFile: jest.fn().mockResolvedValue(cloudinaryResponseMock),
};

const companyServiceMock = {
  findByCompanyName: jest.fn().mockResolvedValue(null),
  findByCompanyId: jest.fn().mockResolvedValue(null),
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

const createEmployeeDtoTestData: CreateEmployeeDto = {
  email: 'bob@test.com',
  name: 'Test Manager',
  phoneNumber: '1224567890',
  companyId: 'genetec',
  role: 1,
};

const createUserDtoTestData: CreateUserDto = {
  email: 'bob@test.com',
  password: 'password',
  name: 'Test Manager',
  phoneNumber: '1224567890',
  role: 4,
};

const updateUserDtoTestData: UpdateUserDto = {
  email: 'bob@test.com',
  newPassword: 'password',
  name: 'Test Manager',
  phoneNumber: '1224567890',
};

const adminInfoTestData = {
  email: 'test@example.com',
  name: 'Test Admin',
  role: 0,
  phoneNumber: '1234567890',
  imageUrl: 'https://example.com/image.jpg',
  imageId: 'image123',
};

const userInfoTestData = {
  email: 'user@example.com',
  name: 'Test User',
  role: 4,
  phoneNumber: '1234567890',
  imageUrl: 'https://example.com/image.jpg',
  imageId: 'image123',
};

const imageMockData: Express.Multer.File = {
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
    cloudinaryServiceMock.uploadFile.mockResolvedValue(cloudinaryResponseMock);
    jest.clearAllMocks();
  });

  describe('uploadImageToCloudinary', () => {
    it('should upload image to cloudinary successfully', async () => {
      // Act
      const result = await service.uploadImageToCloudinary(imageMockData);
      // Assert
      expect(result).toEqual(cloudinaryResponseMock);
    });

    it('should upload image to cloudinary successfully', async () => {
      // Arrange
      cloudinaryServiceMock.uploadFile.mockRejectedValue(new Error());

      // Act
      await expect(
        service.uploadImageToCloudinary(imageMockData),
      ).rejects.toThrow(BadRequestException);
    });
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

    it('should throw an error if saving user fails', async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, 'findOne');
      companyServiceMock.findByCompanyName.mockResolvedValue(false);
      companyServiceMock.createCompany.mockResolvedValue({
        companyId: 'mockId',
      });
      mockingoose(UserModel).toReturn(new Error(), 'save');

      // Act & Assert
      await expect(service.createManager(createManagerDto)).rejects.toThrow(
        HttpException,
      );
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
      mockingoose(UserModel).toReturn(userInfoTestData, 'save');

      // Act
      await service.createManager(createManagerDto, imageMockData);

      // Assert
      expect(cloudinaryServiceMock.uploadFile).toHaveBeenCalledWith(
        imageMockData,
      );
    });
  });

  describe('createEmployee', () => {
    it('should create employee successfully if information is valid', async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, 'findOne');
      companyServiceMock.findByCompanyId.mockResolvedValue({
        companyName: 'genetec',
      });
      mockingoose(UserModel).toReturn(adminInfoTestData, 'save');

      // Act
      const result = await service.createEmployee(createEmployeeDtoTestData);

      // Assert
      expect(result).toBeDefined();
    });

    it('should throw an error if saving employee fails', async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, 'findOne');
      companyServiceMock.findByCompanyId.mockResolvedValue({
        companyName: 'genetec',
      });
      mockingoose(UserModel).toReturn(new Error(), 'save');

      // Act & Assert
      await expect(service.createManager(createManagerDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if email already exists', async () => {
      // Arrange
      mockingoose(UserModel).toReturn({ _id: 'test' }, 'findOne');

      // Act & Assert
      await expect(
        service.createEmployee(createEmployeeDtoTestData),
      ).rejects.toThrow(HttpException);
    });

    it('should throw an error if company doesnt exist', async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, 'findOne');
      companyServiceMock.findByCompanyId.mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.createEmployee(createEmployeeDtoTestData),
      ).rejects.toThrow(HttpException);
    });

    it('should create company if information is valid', async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, 'findOne');

      // Act
      await service.createManager(createManagerDto);

      // Asssert
      expect(companyServiceMock.createCompany).toHaveBeenCalledWith({
        companyName: createManagerDto.companyName,
        companyLocation: createManagerDto.companyLocation,
      });
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

  describe('createUser', () => {
    it('should create user successfully if information is valid', async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, 'findOne');
      mockingoose(UserModel).toReturn(userInfoTestData, 'save');

      // Act
      const result = await service.createUser(createUserDtoTestData);

      // Assert
      expect(result).toBeDefined();
    });

    it('should throw an error if email already exists', async () => {
      // Arrange
      mockingoose(UserModel).toReturn({ _id: 'test' }, 'findOne');

      // Act & Assert
      await expect(service.createUser(createUserDtoTestData)).rejects.toThrow(
        HttpException,
      );
    });

    it('should upload profile image if its valid', async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, 'findOne');

      // Act
      await service.createUser(createUserDtoTestData, imageMockData);

      // Assert
      expect(cloudinaryServiceMock.uploadFile).toHaveBeenCalledWith(
        imageMockData,
      );
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

      mockingoose(UserModel).toReturn(adminInfoTestData, 'findOne');

      // Act
      const result = await service.getProfile({ sub: 't', iat: 1, exp: 2 });

      // Assert
      expect(result).toEqual(
        expect.objectContaining({ ...adminInfoTestData, role: 0 }),
      );
    });
  });

  describe('findAll', () => {
    it('should return all the users', async () => {
      // Arrange
      const users = [adminInfoTestData];
      mockingoose(UserModel).toReturn(users, 'find');

      // Act
      const result = await service.findAll();

      // Assert
      expect(result.length).toBe(users.length);
      expect(result[0]).toEqual(
        expect.objectContaining({ ...adminInfoTestData, role: 0 }),
      );
    });
  });

  describe('remove', () => {
    it('should throw an exception if user doesnt exist', () => {
      // Arrange
      mockingoose(UserModel).toReturn(() => {
        throw new Error();
      }, 'findOneAndRemove');

      // Act & Assert
      expect(service.remove('test')).rejects.toThrow(HttpException);
    });

    it('should remove user if it exists', async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, 'findOneAndRemove');

      // Act
      const result = await service.remove('test');

      // Arrange
      expect(result).toBeDefined();
      expect(result.statusCode).toBe(204);
    });
  });

  describe('getPrivilege', () => {
    it('should return users role', async () => {
      // Arrange
      mockingoose(UserModel).toReturn(adminInfoTestData, 'findOne');

      // Act
      const result = await service.getPrivilege('userId');

      // Assert
      expect(result).toEqual(0);
    });
  });

  describe('updateUser', () => {
    it('should create user successfully if information is valid', async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, 'findOne');
      mockingoose(UserModel).toReturn(userInfoTestData, 'save');

      // Act
      const result = await service.createUser(createUserDtoTestData);

      // Assert
      expect(result).toBeDefined();
    });

    it('should throw an exception if user does not exist', async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, 'findOne');

      // Act & Assert
      await expect(
        service.updateUser('1', updateUserDtoTestData),
      ).rejects.toThrow(HttpException);
    });

    it('should throw an exception if new email already exists', async () => {
      // Arrange
      mockingoose(UserModel).toReturn(
        { ...userInfoTestData, email: updateUserDtoTestData.email },
        'findOne',
      );

      // Act & Assert
      await expect(
        service.updateUser('1', updateUserDtoTestData),
      ).rejects.toThrow(HttpException);
    });

    it('should throw an exception if new phone number already exists', async () => {
      // Arrange
      mockingoose(UserModel).toReturn(
        { ...userInfoTestData, phoneNumber: updateUserDtoTestData.phoneNumber },
        'findOne',
      );

      // Act & Assert
      await expect(
        service.updateUser('1', updateUserDtoTestData),
      ).rejects.toThrow(HttpException);
    });

    it('should update profile image if its valid', async () => {
      // Arrange
      const finderMock = (query: any) => {
        if (query.getQuery()._id === '1') {
          return { ...userInfoTestData, role: 3 };
        }
      };

      mockingoose(UserModel).toReturn(finderMock, 'findOne'); // findById is findOne

      // Act
      await service.updateUser('1', updateUserDtoTestData, imageMockData);

      // Assert
      expect(cloudinaryServiceMock.uploadFile).toHaveBeenCalledWith(
        imageMockData,
      );
    });
  });
});
