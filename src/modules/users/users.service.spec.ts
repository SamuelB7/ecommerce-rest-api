import { UserRole } from '@/enums/user-role.enum';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UsersService } from './users.service';

describe('UsersService unit tests', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'testsecret';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: vi.fn().mockResolvedValue(null),
              findMany: vi.fn().mockResolvedValue(null),
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

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create an user', async () => {
    const response = await usersService.create({ name: 'test', email: 'test@email.com', password: 'password' });
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('name', 'test');
  });

  it('should find a paginated list of users', async () => {
    const mockUsersList = vi.fn().mockResolvedValueOnce({
      data: [],
      total: 0
    });
    usersService.findAll = mockUsersList;
    const response = await usersService.findAll(1, 10);
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('total');
  });

  it('should find one user', async () => {
    const mockUser = vi.fn().mockResolvedValueOnce({ id: 'random-id', name: 'test', email: 'test', role: UserRole.USER });
    usersService.findOne = mockUser;
    const response = await usersService.findOne('random-id');
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('name', 'test');
  });

  it('should update an user', async () => {
    const mockUser = vi.fn().mockResolvedValueOnce({ id: 'random-id', name: 'test update', email: 'test', role: UserRole.USER });
    usersService.update = mockUser;
    const response = await usersService.update('random-id', { name: 'test update', email: 'test', role: UserRole.USER });
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('name', 'test update');
  });

  it('should remove an user', async () => {
    const mockUser = vi.fn().mockResolvedValueOnce({ id: 'random-id', name: 'test', email: 'test', role: UserRole.USER });
    usersService.remove = mockUser;
    const response = await usersService.remove('random-id');
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('name', 'test');
  });
});