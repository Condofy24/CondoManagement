import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SignInDto } from './dto/signin.dto';

interface authDTO {
    email?: string;
    password?: string;
}

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        signIn: jest
                            .fn<Promise<authDTO>, authDTO[]>()
                            .mockImplementation((auth) => 
                                Promise.resolve({...auth})
                        )
                    }
                }
            ]
        }).compile();

        authController = module.get(AuthController);
        authService = module.get(AuthService);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('newAuth', () => {
        it('should authenticate user', () => {
            const newAuthDTO: SignInDto = {
                email: 'email',
                password: 'password'
            };
            expect(authController.signIn(newAuthDTO)).resolves.toEqual({
                ...newAuthDTO
            });
        });
    });
});