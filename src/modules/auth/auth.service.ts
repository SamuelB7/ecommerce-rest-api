import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwt: JwtService,
    ) { }

    async createAccountService(data: Prisma.UserCreateInput): Promise<{ accessToken: string }> {
        const userExists = await this.prismaService.user.findUnique({
            where: {
                email: data.email,
            }
        })

        if (userExists) {
            throw new ConflictException('User with same email already exists.');
        }

        const passwordHash = await hash(data.password, 8);

        const user = await this.prismaService.user.create({
            data: {
                ...data,
                password: passwordHash
            }
        });

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        return {
            accessToken: this.jwt.sign(payload, {
                expiresIn: '24h',
                secret: process.env.JWT_SECRET,
            }),
        }
    }

    async loginService(data: { email: string, password: string }): Promise<{ accessToken: string }> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: data.email,
            }
        })

        if (!user) {
            throw new ConflictException('User not found.');
        }

        const passwordMatch = await compare(data.password, user.password);

        if (!passwordMatch) {
            throw new ConflictException('Invalid credentials.');
        }

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        return {
            accessToken: this.jwt.sign(payload, {
                expiresIn: '24h',
                secret: process.env.JWT_SECRET,
            }),
        }
    }
}
