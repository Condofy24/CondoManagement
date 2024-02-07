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
import { createMock } from '@golevelup/ts-jest';
import { AuthDoc } from './interfaces/auth-document.interface';

export interface MyAuth {
  id: string;
  email: string;
  password: string;
}
// export interface User {
//   id: string;
//   email: string;
//   password: string;
//   name: string;
//   role: number;
//   phoneNumber: string;
//   imageUrl: string;
//   imageId: string;
//   companyId?: string;
// }
const mockAuth = (
  id = 'test',
  email = 'test@gmail.com',
  password = 'test',
): MyAuth => ({
  id,
  email,
  password,
});

const mockAuthDoc = (mock?: Partial<MyAuth>): Partial<AuthDoc> => ({
  id: mock?.id || 'test',
  email: mock?.email || 'test@gmail.com',
  password: mock?.password || 'test',
});

const userArray = [
  mockAuth(),
  mockAuth(
    'test2',
    'test.2@gmail.com',
    'test2',
  ),
  mockAuth(
    'mockAuth',
    'test.3@gmail.com',
    'test3',
  ),
];

const userDocArray: Partial<AuthDoc>[] = [
  mockAuthDoc(),
  mockAuthDoc({
    id: 'test2',
    email: 'test.2@gmail.com',
    password: 'test2',
  }),
  mockAuthDoc({
    id: 'test3',
    email: 'test.3@gmail.com',
    password: 'test3',
  }),
];

describe('AuthService', () => {
    let authService: AuthService;
    let userService: UserService;
    let jwtService: JwtService;
    let model: Model<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers:[
                UserService,
                {
                    provide: getModelToken('User'),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        findById: jest.fn(),
                        update: jest.fn(),
                        create: jest.fn(),
                        remove: jest.fn(),
                        exec: jest.fn(),
                        save: jest.fn(),
                        findByIdAndDelete: jest.fn(),
                        findByIdAndUpdate: jest.fn(),
                        exists: jest.fn().mockResolvedValue(false),
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
                AuthService,
                {
                    provide: UserService,
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn(),
                    },
                }
            ],
        }).compile();
        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        userService = module.get<UserService>(UserService);
        model = module.get<Model<User>>(getModelToken('User'));

    });
    it('should be defined', () => {
        expect(authService).toBeDefined();
      });
    
      afterEach(() => {
        jest.clearAllMocks();
      });
    describe('ownerLogin', () => {
        it('should return UnauthorizedException given incorrect credentials',async () => {
            const mockUser = mockAuthDoc({
                id: 'test2',
                email: "test.2@gmail.com",
                password: 'test2',
              });
            const signInDto: SignInDto = {
                email:"test.2@gmail.com",
                password:"test2"
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

