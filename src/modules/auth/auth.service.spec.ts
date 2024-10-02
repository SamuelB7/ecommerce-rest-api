import { PrismaService } from '@/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service';

describe('AuthService unit tests', () => {
    let authService: AuthService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        process.env.JWT_SECRET = 'testsecret';

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: {
                        user: {
                            findUnique: vi.fn().mockResolvedValue(null),
                            create: vi.fn().mockResolvedValue({ id: 'random-id', name: 'test', email: 'test@email.com', role: 'USER' })
                        }
                    },
                },
            ],
            imports: [
                JwtModule.register({
                    secret: 'testsecret',
                    signOptions: { expiresIn: '24h' },
                }),
            ]
        }).compile();

        authService = module.get<AuthService>(AuthService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should create an account', async () => {
        (prismaService.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);
        const response = await authService.createAccountService({ email: 'test@email.com', password: 'password' });
        expect(response).toHaveProperty('accessToken');
    });

    it('should login', async () => {
        const mockLoginService = vi.fn().mockResolvedValue({ accessToken: 'mockedAccessToken' });
        authService.loginService = mockLoginService;
        const response = await authService.loginService({ email: 'test2@email.com', password: 'password' });
        expect(response).toHaveProperty('accessToken');
        expect(response.accessToken).toBe('mockedAccessToken');
    });
});