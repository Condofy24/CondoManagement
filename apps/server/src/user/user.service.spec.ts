import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import UserDocumentModel, {
  UserUniqueEmailIndex,
  UserUniquePhoneNumberIndex,
} from './entities/user.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserService } from './user.service';
import { BadRequestException, HttpException } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { Readable } from 'stream';
import { buffer } from 'stream/consumers';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UnitService } from '../unit/unit.service';
import { MongoServerError, ObjectId } from 'mongodb';
import { CompanyEntity } from 'src/company/entities/company.entity';
import { before } from 'node:test';

const mockingoose = require('mockingoose'); // eslint-disable-line no-eval

const cloudinaryResponseMock = {
  secure_url: 'https://example.com/image.jpg',
  public_id: 'image123',
};

const cloudinaryServiceMock = {
  uploadFile: jest.fn().mockResolvedValue(cloudinaryResponseMock),
};

const unitServiceTestData = {
  id: 'fdd',
  buildingId: new ObjectId(),
  ownerId: new ObjectId(),
  renterId: new ObjectId(),
  unitNumber: 2,
  size: 2,
  isOccupiedByRenter: true,
  fees: 233,
};

const unitServiceCreateTestData = {
  buildingId: new ObjectId(),
  unitNumber: 11,
  size: 222,
  isOccupiedByRenter: false,
  fees: 222,
};

const verfKeyTestData = {
  id: 'sdsdw',
  unitId: 'sdsds',
  key: 'sdsddsd',
  type: 1,
  claimedBy: 'sdsd',
};

const companyTestData: Partial<CompanyEntity> = {
  _id: new ObjectId(),
  name: 'Test Company',
  location: 'Test Location',
};

const unitServiceMock = {
  findOne: jest.fn().mockResolvedValue(unitServiceTestData),
  createUnit: jest.fn().mockResolvedValue(unitServiceCreateTestData),
  linkUnitToUser: jest.fn().mockResolvedValue(unitServiceTestData),
  findUnitRegistrationKey: jest.fn().mockResolvedValue(verfKeyTestData),
};

const companyServiceMock = {
  findCompanyById: jest.fn().mockResolvedValue(companyTestData),
  findOne: jest.fn().mockResolvedValue(null),
  createCompany: jest.fn().mockResolvedValue(companyTestData),
  deleteCompany: jest.fn().mockResolvedValue(null),
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
  verfKey: '95ad47ea-82d1-4761-b283-5d37ef71c88c',
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

const employeeInfoTestData = {
  email: 'test@example.com',
  name: 'Test Employee',
  role: 2,
  phoneNumber: '0987654321',
  imageUrl: 'https://example.com/image.jpg',
  imageId: 'image123',
};

const userInfoTestData = {
  _id: new ObjectId(),
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

const mongoUniqueIndexException: MongoServerError = {
  addErrorLabel: (_) => {},
  hasErrorLabel: (_) => false,
  name: 'test',
  message: 'etst',
  errmsg: 'duplicate ID',
  errorLabels: [],
  code: 110000,
};

const userModelMock = {
  db: {
    startSession: jest.fn(() => ({
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      endSession: jest.fn(),
    })),
  },
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: UserDocumentModel,
        },
        {
          provide: UnitService,
          useValue: unitServiceMock,
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
    mockingoose(UserDocumentModel).reset();
    cloudinaryServiceMock.uploadFile.mockResolvedValue(cloudinaryResponseMock);
    jest.clearAllMocks();
  });

  describe('createManager', () => {
    it('should create a manager successfully if information is valid', async () => {
      // Arrange
      mockingoose(UserDocumentModel)
        .toReturn(null, 'findOne')
        .toReturn(userInfoTestData, 'save');

      companyServiceMock.findCompanyById.mockResolvedValue(false);

      jest.mock('./entities/user.entity', () => userModelMock);

      // Act
      const result: any = await service.createManager(createManagerDto);

      // Assert
      expect(result).toMatchObject(userInfoTestData);
    });

    it('should throw an error if saving user fails', async () => {
      // Arrange
      mockingoose(UserDocumentModel).toReturn(null, 'findOne');
      companyServiceMock.findCompanyById.mockResolvedValue(false);
      mockingoose(UserDocumentModel).toReturn(new Error(), 'save');

      // Act & Assert
      await expect(service.createManager(createManagerDto)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if email already exists', async () => {
      // Arrange
      const error = {
        ...mongoUniqueIndexException,
        message: UserUniqueEmailIndex,
      };
      mockingoose(UserDocumentModel).toReturn((_: any) => {
        throw error;
      }, 'save');

      // Act & Assert
      await expect(service.createManager(createManagerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if phone number already exists', async () => {
      // Arrange
      const error = {
        ...mongoUniqueIndexException,
        message: UserUniquePhoneNumberIndex,
      };
      mockingoose(UserDocumentModel).toReturn((_: any) => {
        throw error;
      }, 'save');

      // Act & Assert
      await expect(service.createManager(createManagerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if company already exists', async () => {
      // Arrange
      companyServiceMock.createCompany.mockRejectedValue(
        new BadRequestException(),
      );

      // Act & Assert
      await expect(service.createManager(createManagerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create company if information is valid', async () => {
      // Arrange
      mockingoose(UserDocumentModel).toReturn(null, 'findOne');
      companyServiceMock.findCompanyById.mockResolvedValue(false);
      companyServiceMock.createCompany.mockResolvedValue(companyTestData);

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
      mockingoose(UserDocumentModel).toReturn(null, 'findOne');
      companyServiceMock.findCompanyById.mockResolvedValue(false);
      mockingoose(UserDocumentModel).toReturn(userInfoTestData, 'save');

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
      mockingoose(UserDocumentModel).toReturn(null, 'findOne');
      companyServiceMock.findCompanyById.mockResolvedValue(companyTestData);
      mockingoose(UserDocumentModel).toReturn(adminInfoTestData, 'save');

      // Act
      const result = await service.createEmployee(createEmployeeDtoTestData);

      // Assert
      expect(result).toBeDefined();
    });

    it('should throw an error if email already exists', async () => {
      // Arrange
      const error = {
        ...mongoUniqueIndexException,
        message: UserUniqueEmailIndex,
      };
      mockingoose(UserDocumentModel).toReturn((_: any) => {
        throw error;
      }, 'save');

      // Act & Assert
      await expect(service.createManager(createManagerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw an error if phone number already exists', async () => {
      // Arrange
      const error = {
        ...mongoUniqueIndexException,
        message: UserUniquePhoneNumberIndex,
      };
      mockingoose(UserDocumentModel).toReturn((_: any) => {
        throw error;
      }, 'save');

      // Act & Assert
      await expect(service.createManager(createManagerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should throw an error if company doesnt exist', async () => {
      // Arrange
      mockingoose(UserDocumentModel).toReturn(null, 'findOne');
      companyServiceMock.findCompanyById.mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.createEmployee(createEmployeeDtoTestData),
      ).rejects.toThrow(HttpException);
    });

    it('should create company if information is valid', async () => {
      // Arrange
      mockingoose(UserDocumentModel).toReturn(null, 'findOne');

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
      mockingoose(UserDocumentModel).toReturn({ _id: 'test' }, 'findOne');

      // Act
      await service.findUserByEmail('test');

      // Arrange
      await expect(service.findUserByEmail('test')).resolves.toBeDefined();
    });
  });

  // describe('createUser', () => {
  //   beforeEach(async () => {
  //     const module: TestingModule = await Test.createTestingModule({
  //       providers: [
  //         UserService,
  //         {
  //           provide: getModelToken('User'),
  //           useValue: userModelMock,
  //         },
  //         {
  //           provide: UnitService,
  //           useValue: unitServiceMock,
  //         },
  //         {
  //           provide: CloudinaryService,
  //           useValue: cloudinaryServiceMock,
  //         },
  //         {
  //           provide: CompanyService,
  //           useValue: companyServiceMock,
  //         },
  //       ],
  //     }).compile();
  //
  //     service = module.get<UserService>(UserService);
  //   });
  //
  //   it('should create user successfully if information is valid', async () => {
  //     // Arrange
  //     mockingoose(UserDocumentModel).toReturn(null, 'findOne');
  //     mockingoose(UserDocumentModel).toReturn(userInfoTestData, 'save');
  //
  //     // Act
  //     const result = await service.createUser(createUserDtoTestData);
  //
  //     // Assert
  //     expect(result).toBeDefined();
  //   });
  //
  //   it('should throw an error if email already exists', async () => {
  //     // Arrange
  //     const error = {
  //       ...mongoUniqueIndexException,
  //       message: UserUniqueEmailIndex,
  //     };
  //     mockingoose(UserDocumentModel).toReturn((_: any) => {
  //       throw error;
  //     }, 'save');
  //
  //     // Act & Assert
  //     await expect(service.createManager(createManagerDto)).rejects.toThrow(
  //       BadRequestException,
  //     );
  //   });
  //
  //   it('should throw an error if phone number already exists', async () => {
  //     // Arrange
  //     const error = {
  //       ...mongoUniqueIndexException,
  //       message: UserUniquePhoneNumberIndex,
  //     };
  //     mockingoose(UserDocumentModel).toReturn((_: any) => {
  //       throw error;
  //     }, 'save');
  //
  //     // Act & Assert
  //     await expect(service.createManager(createManagerDto)).rejects.toThrow(
  //       BadRequestException,
  //     );
  //   });
  //
  //   it('should upload profile image if its valid', async () => {
  //     // Arrange
  //     mockingoose(UserDocumentModel).toReturn(null, 'findOne');
  //
  //     // Act
  //     await service.createUser(createUserDtoTestData, imageMockData);
  //
  //     // Assert
  //     expect(cloudinaryServiceMock.uploadFile).toHaveBeenCalledWith(
  //       imageMockData,
  //     );
  //   });
  // });

  describe('findAll employees', () => {
    it('should return all the employees', async () => {
      // Arrange
      const users = [employeeInfoTestData];
      mockingoose(UserDocumentModel).toReturn(users, 'find');

      // Act
      const result = await service.findAll({ companyId: 'companyId' });

      // Assert
      expect(result[0]).toEqual(
        expect.objectContaining({
          ...employeeInfoTestData,
        }),
      );
    });
  });

  describe('remove', () => {
    it('should throw an exception if user doesnt exist', () => {
      // Arrange
      mockingoose(UserDocumentModel).toReturn(() => {
        throw new Error();
      }, 'findOneAndRemove');

      // Act & Assert
      expect(service.remove('test')).rejects.toThrow(HttpException);
    });

    it('should remove user if it exists', async () => {
      // Arrange
      mockingoose(UserDocumentModel).toReturn(null, 'findOneAndRemove');

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
      mockingoose(UserDocumentModel).toReturn(adminInfoTestData, 'findOne');

      // Act
      const result = await service.getPrivilege('userId');

      // Assert
      expect(result).toEqual(0);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully if information is valid', async () => {
      // Arrange
      const finderMock = (query: any) => {
        if (query.getQuery()._id === userInfoTestData._id.toString()) {
          return { ...userInfoTestData, role: 3 };
        }
      };

      mockingoose(UserDocumentModel).toReturn(finderMock, 'findOne'); // findById is findOne

      // Act
      const result = await service.updateUser(
        userInfoTestData._id.toString(),
        updateUserDtoTestData,
      );

      // Assert
      expect(result).toBeDefined();
    });

    it('should throw an exception if user does not exist', async () => {
      // Arrange
      mockingoose(UserDocumentModel).toReturn(null, 'findOne');

      // Act & Assert
      await expect(
        service.updateUser('1', updateUserDtoTestData),
      ).rejects.toThrow(HttpException);
    });

    it('should throw an exception if new email already exists', async () => {
      // Arrange
      mockingoose(UserDocumentModel).toReturn(
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
      mockingoose(UserDocumentModel).toReturn(
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

      mockingoose(UserDocumentModel).toReturn(finderMock, 'findOne'); // findById is findOne

      // Act
      await service.updateUser('1', updateUserDtoTestData, imageMockData);

      // Assert
      expect(cloudinaryServiceMock.uploadFile).toHaveBeenCalledWith(
        imageMockData,
      );
    });
  });
});
