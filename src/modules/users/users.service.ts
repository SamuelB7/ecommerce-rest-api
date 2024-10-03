import { PrismaService } from '@/prisma/prisma.service';
import { paginatedData } from '@/utils/paginated-data';
import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {

    const passwordHash = await hash(createUserDto.password, 7);

    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: createUserDto.email
      }
    })

    if (userExists) {
      throw new ConflictException('User with same email already exists.');
    }

    return await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: passwordHash
      }
    })
  }

  async findAll(page: number, limit: number): Promise<paginatedData<User>> {
    const users = await this.prismaService.user.findMany({
      skip: (page - 1) * limit,
      take: limit
    });

    const total = await this.prismaService.user.count();

    return {
      data: users,
      total
    }
  }

  async findOne(id: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        id
      }
    })
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {

    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password, 7);
    }

    return await this.prismaService.user.update({
      where: {
        id
      },
      data: updateUserDto
    })
  }

  async remove(id: string): Promise<User> {
    return await this.prismaService.user.delete({
      where: {
        id
      }
    })
  }
}
