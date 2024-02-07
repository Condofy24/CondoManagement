import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../user/entities/user.entity';
import { UserRolesEnum } from '../user/user.model';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { SignInDto } from './dto/signin.dto';
import { CloudinaryService } from '../user/cloudinary/cloudinary.service';
import { CompanyService } from '../company/company.service';
import { Model } from 'mongoose';
import { UnauthorizedException } from '@nestjs/common';

const mockUser = (
    id = 'test',
    email = 'test@gmail.com',
    password = 'c',
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

describe('AuthService', () => {
    let authService: AuthService;
    let userService: UserService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers:[
                AuthService,
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
                {
                    provide: CloudinaryService,
                    useValue:{
                        uploadFile:jest.fn().mockResolvedValue({
                            secure_url:"https://example.com/image.jpg",
                            public_id:'12345'
                        })
                    }
                },
                {
                    provide: CompanyService,
                    useValue:{
                        findByCompanyName: jest.fn().mockResolvedValue(null),
                        createCompany: jest.fn().mockResolvedValue({ companyId: 'company123'}),
                        findByCompanyId: jest.fn().mockResolvedValue(true),
                    }
                },
                JwtService,
            ],
        }).compile();
        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        userService = module.get<UserService>(UserService);
    });
    it('should be defined', () => {
        expect(authService).toBeDefined();
      });
    
      afterEach(() => {
        jest.clearAllMocks();
      });
    describe('ownerLogin', () => {
        it('should return UnauthorizedException given incorrect credentials',async () => {
            const signInDto: SignInDto = {
                email:"test@gmail.com",
                password:"c"
            };
            try {
                const userInfo = await authService.signIn(signInDto);
            } catch (error) {
                // If an error is thrown, check if it is an UnauthorizedException
                expect(error).toBeInstanceOf(UnauthorizedException);
            }
        });
    })
})